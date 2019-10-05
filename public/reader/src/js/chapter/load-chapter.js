import { fetchBook } from "../book/books-store.js";
import { getChapter } from "./get-chapter.js";
import { addChapterToPage } from "./chapter-rendering.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { showSnackbar } from "../components/snackbar.js";

export function getAndRenderChapter(bookTitle, chapterNumber) {
    return fetchBook(bookTitle)
        .then(({chapters}) => getChapter(chapters[chapterNumber].link))
        .then((chapter) => addChapterToPage(chapter, chapterNumber))
}

export function loadChapter(bookTitle, lazyLoad) {
    fetchBook(bookTitle)
        .then(({lastRead}) => {
            showLoader();
            const loadChapterPromise = getAndRenderChapter(bookTitle, lastRead, true);
            loadChapterPromise
                .catch((error) => {
                    console.error(error);
                    showSnackbar("Error: " + error.message);
                })
                .finally(hideLoader);
        })
}