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
    const rangeStart = values.start;
    const rangeEnd = values.end;

    // added 1 so that total includes the start and end
    const total = (rangeEnd - rangeStart) + 1;
    const bookCount = Math.ceil(total / limiter);

    let bookStart = rangeStart;
    let bookEnd;

    for (let i = 1; i <= bookCount; i += 1) {
        if (bookStart > rangeEnd) {
            break;
        }
        // subtracted 1 because urls generated will be inclusive of end
        bookEnd = (bookStart + limiter) - 1;
        bookEnd = bookEnd < rangeEnd ? bookEnd : rangeEnd;

        const urls = generateUrls(values.url, bookStart, bookEnd);
        let title = `${values.title} ${bookStart}-${bookEnd}`;
        if (bookStart === bookEnd) {
            title = `${values.title} ${bookStart}`;
        }
        books.push({
            title,
            urls,
        });
        bookStart = bookEnd + 1;
    }
    books.reverse();// reversing array so that we can pop the book object in chronological order
    publishBooks({ mode, args, books });
}

export default createBooks;
