const booksDB = localforage.createInstance({name: "books"});

export async function getBooks() {
    const books = [];
    await booksDB.iterate(function (value) {
        books.push(value)
    });
    return books;
}

export function storeBook(name, book) {
    if (book.lastRead < 0) {
        book.lastRead = 0
    }
    booksDB.setItem(name, book)
}