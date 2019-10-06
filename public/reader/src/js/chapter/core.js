import { hideLoader, showLoader } from "../components/loader.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { showSnackbar } from "../components/snackbar.js";
import { throttle } from "../util/dom-util.js";

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
    window.onscroll = throttle(function() {
        const currentScrollPosition = window.pageYOffset;
        const scrollingUp = prevScrollPosition > currentScrollPosition;
        if (scrollingUp) {
            document.getElementById("bottom-nav-bar").style.bottom = "0";
        } else {
            document.getElementById("bottom-nav-bar").style.bottom = "-50px";
        }
        prevScrollPosition = currentScrollPosition;
    }, 100);
}

function init() {
    autoHideNavBar();
    const bookTitle = getBookTitle();
    window.bookReader = {bookTitle};
    document.title = bookTitle;
    showLoader();
    getAndRenderChapter(bookTitle, getChapterNumber())
        .catch((error) => {
            console.error(error);
            showSnackbar("Error: " + error.message);
        })
        .finally(hideLoader);
}

init();