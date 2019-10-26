import { hideLoader, showLoader } from "../components/loader.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { showSnackbar } from "../components/snackbar.js";
import { throttle } from "../util/dom-util.js";
import { storeOrUpdateBook } from "../book/books-store.js";
import { fontSettingsInit } from "./font-settings.js";
import { loadChapterList } from "./chapter-list.js";

const search = new URLSearchParams(window.location.search);
const bookTitle = search.get("book");
const chapterNumber = parseInt(search.get("chapter"), 10);

function autoHideNavBar() {
    let prevScrollPosition = window.pageYOffset;
    let topNavBar = document.getElementById("top-nav-bar");
    let bottomNavBar = document.getElementById("bottom-nav-bar");
    window.onscroll = throttle(function () {
        const currentScrollPosition = window.pageYOffset;
        const scrollingUp = prevScrollPosition > currentScrollPosition;
        if (scrollingUp) {
            topNavBar.style.top = "0";
            bottomNavBar.style.bottom = "0";
        } else {
            topNavBar.style.top = `-${topNavBar.scrollHeight + 10}px`;
            bottomNavBar.style.bottom = `-${bottomNavBar.scrollHeight + 10}px`;
        }
        prevScrollPosition = currentScrollPosition;
    }, 100);
}

function updateLastRead(bookTitle, chapterNumber) {
    storeOrUpdateBook(bookTitle, {lastRead: chapterNumber});
}

function init() {
    hideLoader();
    window.bookReader = {bookTitle};
    document.title = bookTitle;
    showLoader();
    autoHideNavBar();
    fontSettingsInit();
    loadChapterList();
    updateLastRead(bookTitle, chapterNumber);
    getAndRenderChapter(bookTitle, chapterNumber)
        .catch((error) => showSnackbar("Error: " + error.message))
        .finally(hideLoader);
}

init();