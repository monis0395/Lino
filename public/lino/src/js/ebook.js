import EpubPress from 'epub-press-js';
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

function createBooks(values, mode, args) {
    const books = [];

    // added 1 so that total includes the start and end
    const total = (values.end - values.start) + 1;
    const count = Math.ceil(total / limiter);

    for (let i = 1, base = values.start; i <= count && base <= values.end; i += 1) {
        const start = base;
        // subtracted 1 because urls generated will be inclusive of end
        let end = (base + limiter) - 1;
        end = end < values.end ? end : values.end;

        const urls = generateUrls(values.url, start, end);
        let title = `${values.title} ${start}-${end}`;
        if (start === end) {
            title = `${values.title} ${start}`;
        }
        books.push({
            title,
            urls,
        });
        base = end + 1;
    }
    books.reverse();// reversing array so that we can pop the book object in chronological order
    publishBooks({ mode, args, books });
}

export default createBooks;
