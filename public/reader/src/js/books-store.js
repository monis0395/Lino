const booksDB = localforage.createInstance({
    name: "books"
});

export function getBooks() {
    const books = [];
    return new Promise((resolve, reject) => {
        booksDB
            .iterate(function (value) {
                books.push(value)
            })
            .then(() => resolve(books))
            .catch((error) => reject(error))
    });
}