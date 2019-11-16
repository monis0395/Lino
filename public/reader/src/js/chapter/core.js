import { hideLoader, showLoader } from "../components/loader.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { showSnackbar } from "../components/snackbar.js";
import { getElementByXpath, scrollToElement, throttle } from "../util/dom-util.js";
import { fetchBook, storeOrUpdateBook } from "../book/books-store.js";
import { fontSettingsInit } from "./font-settings.js";
import { loadChapterList } from "./chapter-list.js";
import { initChapterListener } from "./chapter-listener.js";
import { fetchChapter } from "./chapter-store.js";

const search = new URLSearchParams(window.location.search);
const bookTitle = search.get("book");
const chapterNumber = parseInt(search.get("chapter"), 10) || 0;

function autoHideNavBar() {
    let prevScrollPosition = window.pageYOffset;
    let topNavBar = document.getElementById("top-nav-bar");
    let bottomNavBar = document.getElementById("bottom-nav-bar");

    function toggleNavBar() {
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
    }

    window.addEventListener('scroll', throttle(toggleNavBar, 1000));
}

function updateLastRead(bookTitle, chapterNumber) {
    return storeOrUpdateBook(bookTitle, {
        lastRead: chapterNumber,
        lastReadTimestamp: Date.now(),
    });
}

function init() {
    hideLoader();
    window.bookReader = {bookTitle};
    document.title = bookTitle;
    showLoader();
    updateLastRead(bookTitle, chapterNumber).then(() => {
        autoHideNavBar();
        fontSettingsInit();
        loadChapterList();
        getAndRenderChapter(bookTitle, chapterNumber)
            .then(() => {
                return fetchBook(bookTitle)
            })
            .then((book) => {
                const chapter = book.chapters[chapterNumber];
                return fetchChapter(chapter.link)
            })
            .then((chapter) => {
                const xpath = chapter.lastReadElementXpath;
                const element = getElementByXpath(xpath);
                if (element) {
                    scrollToElement(element, null, false);
                }
            })
            .catch((error) => showSnackbar("Error: " + error.message))
            .finally(() => {
                hideLoader();
                initChapterListener();
            });
    });
}

init();