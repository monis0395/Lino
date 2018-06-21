import EpubPress from 'epub-press-js';
import range from 'lodash.range';
import { limiter } from './constants';

function generateUrls(url, start, end) {
    const urls = [];
    for (let i = start; i <= end; i += 1) {
        urls.push(url + i);
    }
    return urls;
}

function publishBooks(booksObject) {
    function publishBook() {
        const book = booksObject.books.pop();
        if (!book) {
            return;
        }
        const eBook = new EpubPress({
            title: book.title,
            urls: book.urls,
        });
        eBook.publish().then(() => {
            if (booksObject.mode === 'download') {
                return eBook.download(...booksObject.args);
            }
            if (booksObject.mode === 'email') {
                return eBook.email(...booksObject.args);
            }
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

    if (startIndexOfBooks.length !== 0) {
        bookStart = startIndexOfBooks[i];
        bookEnd = volumeEnd;
    }
    books.push({
        start: bookStart,
        end: bookEnd,
    });

    return books;
}

function createBooks(values, mode, args) {
    const books = [];

    const volumes = createVolumes(values.start, values.end, limiter);
    let urls;
    let title;

    volumes.forEach((book) => {
        title = `${values.title} ${book.start}-${book.end}`;
        urls = generateUrls(values.url, book.start, book.end);
        books.push({ title, urls });
    });

    books.reverse();// reversing array so that we can pop the book object in chronological order
    publishBooks({ mode, args, books });
}

export default createBooks;
