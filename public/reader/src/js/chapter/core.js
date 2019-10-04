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
    showLoader();
    fetchBook(bookTitle)
        .then((book) => {
            const {link, title} = book.chapters[chapterNumber];
            getChapter(link)
                .then((chapter) => {
                    addChapterToPage(chapter, chapterNumber, title);
                    hideLoader();
                })
        })
        .catch((error) =>{
            hideLoader();
            showSnackbar("Error: " + error.message);
        });
}

function init() {
    const bookTitle = getBookTitle();
    const chapterNumber = getChapterNumber();
    getAndRenderChapter(bookTitle, chapterNumber);
}

init();