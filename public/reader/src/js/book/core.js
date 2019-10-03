import { getBooks } from "./books-store.js";
import { addBookInit } from "./add-book.js";
import { addBookToPage } from "./books-rendering.js";

function loadBooks() {
    getBooks().then((books) => books.forEach(addBookToPage));
}

function init() {
    addBookInit();
    loadBooks();
}

init();