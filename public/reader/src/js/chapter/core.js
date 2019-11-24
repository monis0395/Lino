import { hideLoader, showLoader } from "../components/loader.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { showSnackbar } from "../components/snackbar.js";
import { getElementByXpath, isDescendant, scrollToElement, throttle } from "../util/dom-util.js";
import { fetchBook, storeOrUpdateBook } from "../book/books-store.js";
import { loadChapterList } from "./chapter-list.js";
import { initChapterListener } from "./chapter-listener.js";
import { fetchChapter } from "./chapter-store.js";
import { requestNStoreChapter } from "./get-chapter.js";
import { getChapterElement, removeChapter } from "./chapter-rendering.js";
import { updateInfoChapterName } from "../components/chapter-info-bar.js";

const search = new URLSearchParams(window.location.search);
const bookTitle = search.get("book");
const chapterNumber = parseInt(search.get("chapter"), 10) || 0;

let prevScrollPosition = window.pageYOffset;
function autoHideNavBar() {
    let topNavBar = document.getElementById("top-nav-bar");
    let bottomNavBar = document.getElementById("bottom-nav-bar");
    let visible = true;

    function hideNavBar() {
        topNavBar.style.top = `-${topNavBar.scrollHeight + 10}px`;
        bottomNavBar.style.bottom = `-${bottomNavBar.scrollHeight + 10}px`;
        visible = false;
    }

    function showNavBar() {
        topNavBar.style.top = "0";
        bottomNavBar.style.bottom = "0";
        visible = true;
    }

    function handleScroll() {
        const currentScrollPosition = window.pageYOffset;
        if (Math.abs(prevScrollPosition - currentScrollPosition) > 32) {
            const scrollingUp = prevScrollPosition > currentScrollPosition;
            if (scrollingUp) {
                // showNavBar();
            } else {
                hideNavBar();
            }
        }
        prevScrollPosition = currentScrollPosition;
    }

    function toggleNavBar() {
        const currentScrollPosition = window.pageYOffset;
        if (Math.abs(prevScrollPosition - currentScrollPosition) >= 5) {
            return;
        }
        if (visible) {
            hideNavBar();
        } else {
            showNavBar();
        }
    }

    const page = document.getElementsByClassName('page')[0];
    page.onclick = (e) => {
        const element = e.target;
        if (topNavBar === element
            || bottomNavBar === element
            || isDescendant(topNavBar, element)
            || isDescendant(bottomNavBar, element)) {
            return
        }
        toggleNavBar();
    };
    setTimeout(hideNavBar, 1000);
    window.addEventListener('scroll', throttle(handleScroll, 100));
}

function updateLastRead(bookTitle, chapterNumber) {
    return storeOrUpdateBook(bookTitle, {
        lastRead: chapterNumber,
        lastReadTimestamp: Date.now(),
    });
}

function scrollToLastReadElement() {
    return fetchBook(bookTitle)
        .then((book) => {
            const totalChapters = book.chapters.length;
            const nextChapterNumber = chapterNumber + 1;
            if (nextChapterNumber < totalChapters) {
                getAndRenderChapter(bookTitle, chapterNumber + 1);
            }
            const chapter = book.chapters[chapterNumber];
            return fetchChapter(chapter.link)
        })
        .then((chapter) => {
            const xpath = chapter.lastReadElementXpath;
            const element = getElementByXpath(xpath);
            if (xpath) {
                scrollToElement(element, null, false);
            }
        })
}

function attachChapterReloadListener() {
    const reloadChapterBtn = document.getElementById("reload-chapter-btn");
    reloadChapterBtn.onclick = () => {
        let lastReadChapter;
        showLoader();
        fetchBook(bookTitle)
            .then(({chapters, lastRead}) => {
                lastReadChapter = lastRead;
                const chapterURL = chapters[lastRead].link;
                return requestNStoreChapter(chapterURL);
            })
            .then(() => {
                removeChapter(lastReadChapter);
                return getAndRenderChapter(bookTitle, lastReadChapter)
            })
            .then(() => showSnackbar(`Updated chapter`))
            .catch((error) => {
                window.console.error(error);
                showSnackbar("Error: " + error.message)
            })
            .finally(hideLoader)
    }
}

function init() {
    hideLoader();
    window.bookReader = {bookTitle};
    document.title = bookTitle;
    showLoader();
    updateLastRead(bookTitle, chapterNumber).then(() => {
        // fontSettingsInit();
        loadChapterList();
        attachChapterReloadListener();
        getAndRenderChapter(bookTitle, chapterNumber)
            .then(() => {
                const chapterElement = getChapterElement(chapterNumber);
                updateInfoChapterName(chapterElement)
            })
            .then(scrollToLastReadElement)
            .catch((error) => showSnackbar("Error: " + error.message))
            .finally(() => {
                hideLoader();
                autoHideNavBar();
                initChapterListener();
            });
    });
}

init();