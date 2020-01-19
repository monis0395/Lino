import { addBookInit } from "./add-book.js";
import { loadBooks } from "./books-rendering.js";
import { getBook } from "./get-book.js";
import { checkAndReloadBooks } from "./update-books.js";
import { isTabletOrMobile } from "../util/browser-util.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { getBooks } from "./books-store.js";

function loadFirstBook() {
    getBooks()
        .then((books) => {
            if (books.length > 0) {
                return;
            }
            const THE_NOVELS_EXTRA = "https://www.wuxiaworld.com/novel/the-novels-extra";
            getBook(THE_NOVELS_EXTRA);
        });
}

function pullToRefresh() {
    const pullToRefreshScript = document.createElement("script");
    pullToRefreshScript.src = "../js/third-party/pulltorefreshjs.js";
    pullToRefreshScript.onload = () => {
        window.PullToRefresh.init({
            onRefresh: checkAndReloadBooks,
        });
    };
    document.body.appendChild(pullToRefreshScript);
}

function init() {
    hideLoader();
    window.bookReader = window.bookReader || {};
    addBookInit();
    window.addEventListener("pageshow", () => {
        showLoader();
        loadBooks()
            .finally(hideLoader);
        console.log("pageshow called");
    }, false);
    loadFirstBook();
    if (isTabletOrMobile()) {
        pullToRefresh();
    }
}

init();
