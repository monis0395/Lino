const booksDB = localforage.createInstance({name: "books"});

export async function getBooks() {
    const books = [];
    await booksDB.iterate(function (value) {
        books.push(value)
    });
    return books;
}

export async function fetchBook(title) {
    return booksDB.getItem(title);
}

export async function storeBook(title, book) {
    if (!book.hasOwnProperty("lastRead")) {
        book.lastRead = 0
    }
    return booksDB.setItem(title, book)
}