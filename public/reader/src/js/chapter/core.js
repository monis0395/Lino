import { hideLoader, showLoader } from "../components/loader";
import { getAndRenderChapter } from "./load-chapter";
import { showSnackbar } from "../components/snackbar";

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