import { addBookInit } from "./add-book.js";
import { loadBooks } from "./books-rendering.js";
import { getBook } from "./get-book.js";
import { checkAndReloadBooks } from "./update-books.js";

function loadFirstBook() {
    const done = localStorage.getItem("first");
    if (done) {
        return;
    }
    const THE_NOVELS_EXTRA = "https://www.wuxiaworld.com/novel/the-novels-extra";
    getBook(THE_NOVELS_EXTRA);
    localStorage.setItem("first", "done");
}

function pullToRefresh() {
    window.PullToRefresh.init({
        mainElement: 'body',
        onRefresh: checkAndReloadBooks,
    });
}

function init() {
    addBookInit();
    loadBooks();
    loadFirstBook();
    pullToRefresh()
}

init();