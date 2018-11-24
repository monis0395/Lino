import EpubPress from 'epub-press-js';
import range from 'lodash.range';
import {generateUrls} from './util';
import {addMessageBox, updateProgress} from "./message-box";
import {limiter} from './constants';

function publishBooks(books) {
    function publishBook() {
        const book = books.pop();
        if (!book) {
            return;
        }
        const eBook = new EpubPress({
            title: book.title,
            urls: book.urls,
            filetype: book.fileType,
        });

        const messageBoxId = addMessageBox(book.title);
        eBook.on('statusUpdate', (status) => {
            updateProgress(messageBoxId, status.progress, status.message);
        });

        eBook.publish().then(() => {
            if (book.email) {
                return eBook.email(book.email);
            }
            return eBook.download();
        }).then(publishBook);
    }

    books.reverse();// reversing array so that we can pop the book object in chronological order
    publishBook();
}

function createVolumes(chapterStart, chapterEnd, volumeMaxChapters) {
    const volumesStartIndices = range(chapterStart, chapterEnd, volumeMaxChapters);
    const volumes = [];
    let volumeStart;
    let volumeEnd;

    for (let i = 0; i < volumesStartIndices.length; i += 1) {
        volumeStart = volumesStartIndices[i];
        volumeEnd = volumesStartIndices[i + 1] - 1 || chapterEnd;
        volumes.push({
            start: volumeStart,
            end: volumeEnd,
        });
    }
    return volumes;
}

function createEBooks(values, fileType, email) {
    const eBooks = [];
    const volumes = createVolumes(values.start, values.end, limiter);
    let urls;
    let title;

    volumes.forEach((book) => {
        title = `${values.title} ${book.start}-${book.end}`;
        urls = generateUrls(values.url, book.start, book.end);
        eBooks.push({
            title, urls, fileType, email,
        });
    });

    return eBooks;
}

export {createEBooks, publishBooks};
