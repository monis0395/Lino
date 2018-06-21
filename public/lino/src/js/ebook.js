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

    publishBook();
}

function createVolumes(volumeStart, volumeEnd, volumeChaptersCount) {
    if (volumeStart > volumeEnd) {
        return [];
    }

    const startIndexOfBooks = range(volumeStart, volumeEnd, volumeChaptersCount);
    const books = [];
    let i;

    // will be used if start and end are equal only one chpater will be present
    let bookStart = volumeStart;
    let bookEnd = volumeEnd;
    for (i = 0; i < startIndexOfBooks.length - 1; i += 1) {
        bookStart = startIndexOfBooks[i];
        bookEnd = startIndexOfBooks[i + 1] - 1;
        books.push({
            start: bookStart,
            end: bookEnd,
        });
    }

    if (notEmpty(startIndexOfBooks)) {
        bookStart = startIndexOfBooks[i];
        bookEnd = volumeEnd;
    }
    books.push({
        start: bookStart,
        end: bookEnd,
    });

    return books;
}

function createBooks(values, fileType, email) {
    const books = [];

    const volumes = createVolumes(values.start, values.end, limiter);
    let urls;
    let title;

    volumes.forEach((book) => {
        title = `${values.title} ${book.start}-${book.end}`;
        urls = generateUrls(values.url, book.start, book.end);
        books.push({
            title, urls, fileType, email,
        });
    });

    books.reverse();// reversing array so that we can pop the book object in chronological order
    publishBooks(books);
}

export default createBooks;
