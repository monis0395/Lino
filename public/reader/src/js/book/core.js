import { addBookInit } from "./add-book.js";
import { loadBooks } from "./books-rendering.js";


function init() {
    addBookInit();
    loadBooks();
}

init();