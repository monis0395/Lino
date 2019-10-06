import { addBookInit } from "./add-book.js";
import { loadBooks } from "./books-rendering.js";
import { getBook } from "./get-book.js";
import { checkAndReloadBooks } from "./update-books.js";
import { isTabletOrMobile } from "../util/browser-util.js";

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
    const pullToRefreshScript = document.createElement("script");
    pullToRefreshScript.src = "https://unpkg.com/pulltorefreshjs@latest/dist/index.umd.min.js";
    pullToRefreshScript.onload = () => {
        window.PullToRefresh.init({
            mainElement: 'body',
            onRefresh: checkAndReloadBooks,
        });
    };
    document.body.appendChild(pullToRefreshScript);
}

function init() {
    window.bookReader = window.bookReader || {};
    addBookInit();
    loadBooks();
    loadFirstBook();
    if (isTabletOrMobile()) {
        pullToRefresh();
    }
}

init();