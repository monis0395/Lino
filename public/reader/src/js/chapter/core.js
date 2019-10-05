import { fetchBook } from "../book/books-store.js";
import { getChapter } from "./get-chapter.js";
import { addChapterToPage } from "./chapter-rendering.js";
import { showSnackbar } from "../components/snackbar.js";
import { hideLoader, showLoader } from "../components/loader.js";

function getBookTitle() {
    const search = new URLSearchParams(window.location.search);
    return search.get("book");
}

function getChapterNumber() {
    const search = new URLSearchParams(window.location.search);
    return search.get("chapter");
}

function getAndRenderChapter(bookTitle, chapterNumber) {
    return fetchBook(bookTitle)
        .then(({chapters}) => getChapter(chapters[chapterNumber].link))
        .then((chapter) => addChapterToPage(chapter, chapterNumber))
        .catch((error) => {
            hideLoader();
            console.error(error);
            showSnackbar("Error: " + error.message);
        });
}

function loadChapter() {
    const bookTitle = getBookTitle();
    const chapterNumber = parseInt(getChapterNumber(), 10);
    showLoader();
    const loadChapterPromise = getAndRenderChapter(bookTitle, chapterNumber, true);
    loadChapterPromise.finally(() => {
        hideLoader();
        getAndRenderChapter(bookTitle, chapterNumber + 1, false);
    });
}

function init() {
    loadChapter()
}

init();