import { addBookInit } from "./add-book.js";
import { loadBooks } from "./books-rendering.js";
import { getBook } from "./get-book.js";

function loadFirstBook() {
    const done = localStorage.getItem("first");
    if (done) {
        return;
    }
    const tcf = "https://www.wuxiaworld.com/novel/trash-of-the-counts-family";
    getBook(tcf);
    localStorage.setItem("first", "done");
}

function init() {
    addBookInit();
    loadBooks();
    loadFirstBook();
}

init();