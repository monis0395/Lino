import { hideLoader, showLoader } from "../components/loader.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { showSnackbar } from "../components/snackbar.js";
import { throttle } from "../util/dom-util.js";
import { fetchBook } from "../book/books-store.js";
import { getChapterLink } from "../components/chapter-url.js";
import { fontSettingsInit } from "./font-settings.js";

function getBookTitle() {
    const search = new URLSearchParams(window.location.search);
    return search.get("book");
}

function getChapterNumber() {
    const search = new URLSearchParams(window.location.search);
    return parseInt(search.get("chapter"), 10);
}

function autoHideNavBar() {
    let prevScrollPosition = window.pageYOffset;
    let topNavBar = document.getElementById("top-nav-bar");
    let bottomNavBar = document.getElementById("bottom-nav-bar");
    window.onscroll = throttle(function() {
        const currentScrollPosition = window.pageYOffset;
        const scrollingUp = prevScrollPosition > currentScrollPosition;
        if (scrollingUp) {
            topNavBar.style.top = "0";
            bottomNavBar.style.bottom = "0";
        } else {
            topNavBar.style.top = `-${topNavBar.scrollHeight}px`;
            bottomNavBar.style.bottom = `-${bottomNavBar.scrollHeight}px`;
        }
        prevScrollPosition = currentScrollPosition;
    }, 100);
}

function loadChapterList() {
    const chaptersList = document.getElementById("chapters-list");
    const bookTitle = window.bookReader.bookTitle;
    fetchBook(bookTitle)
        .then(({chapters}) => {
            chapters.forEach((chapter, index) => {
                const chapterLink = getChapterLink(bookTitle, index);
                const chapterAnchorTag = document.createElement("a");
                chapterAnchorTag.href = chapterLink;
                chapterAnchorTag.innerText = `${index +1}. ${chapter.title}`;
                chaptersList.appendChild(chapterAnchorTag);
            })
        })
}

function init() {
    hideLoader();
    fontSettingsInit();
    autoHideNavBar();
    const bookTitle = getBookTitle();
    window.bookReader = {bookTitle};
    document.title = bookTitle;
    showLoader();
    loadChapterList();
    getAndRenderChapter(bookTitle, getChapterNumber())
        .catch((error) => {
            console.error(error);
            showSnackbar("Error: " + error.message);
        })
        .finally(hideLoader);
}

init();