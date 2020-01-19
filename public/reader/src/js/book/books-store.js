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

export async function removeBook(title) {
    return booksDB.removeItem(title)
}

export async function storeOrUpdateBook(title, book) {
    const oldBook = await booksDB.getItem(title) || {};
    return booksDB.setItem(title, {
        ...oldBook,
        ...book,
    })
}
