import { hideLoader, showLoader } from "../components/loader.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { showSnackbar } from "../components/snackbar.js";

function getBookTitle() {
    const search = new URLSearchParams(window.location.search);
    return search.get("book");
}

function getChapterNumber() {
    const search = new URLSearchParams(window.location.search);
    return parseInt(search.get("chapter"), 10);
}

function init() {
    const bookTitle = getBookTitle();
    window.bookReader = {bookTitle};
    showLoader();
    getAndRenderChapter(bookTitle, getChapterNumber())
        .catch((error) => {
            console.error(error);
            showSnackbar("Error: " + error.message);
        })
        .finally(hideLoader);
}

init();