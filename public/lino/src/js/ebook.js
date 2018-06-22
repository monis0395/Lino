import EpubPress from 'epub-press-js';
import notEmpty from 'util-nonempty';
import range from 'lodash.range';
import { limiter } from './constants';

function generateUrls(url, start, end) {
    const urls = [];
    for (let i = start; i <= end; i += 1) {
        urls.push(url + i);
    }
    return urls;
}

function publishBooks(books) {
    function publishBook() {
        const book = books.pop();
        if (!notEmpty(book)) {
            return;
        }
        const eBook = new EpubPress({
            title: book.title,
            urls: book.urls,
            filetype: book.fileType,
        });
        eBook.publish().then(() => {
            if (notEmpty(book.email)) {
                return eBook.email(book.email);
            }
            return eBook.download();
        }).then(publishBook);
    }

    books.reverse();// reversing array so that we can pop the book object in chronological order
    publishBook();
}

function createVolumes(chapterStart, chapterEnd, volumeMaxChapters) {
    if (chapterStart > chapterEnd) {
        return [];
    }

    const volumesStartIndices = range(chapterStart, chapterEnd, volumeMaxChapters);
    const volumes = [];
    let i;
    let volumeStart;
    let volumeEnd;

    for (i = 0; i < volumesStartIndices.length - 1; i += 1) {
        volumeStart = volumesStartIndices[i];
        volumeEnd = volumesStartIndices[i + 1] - 1;
        volumes.push({
            start: volumeStart,
            end: volumeEnd,
        });
    }

    if (notEmpty(volumesStartIndices)) {
        volumeStart = volumesStartIndices[i];
        volumeEnd = chapterEnd;
    }
    volumes.push({
        start: volumeStart || chapterStart,
        end: volumeEnd || chapterEnd,
    });

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

export { createEBooks, publishBooks };
