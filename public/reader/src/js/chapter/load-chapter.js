import { fetchBook } from "../book/books-store";
import { getChapter } from "./get-chapter";
import { addChapterToPage } from "./chapter-rendering";
import { hideLoader, showLoader } from "../components/loader";
import { showSnackbar } from "../components/snackbar.js";

export function getAndRenderChapter(bookTitle, chapterNumber) {
    return fetchBook(bookTitle)
        .then(({chapters}) => getChapter(chapters[chapterNumber].link))
        .then((chapter) => addChapterToPage(chapter, chapterNumber))
}

export function loadChapter(bookTitle, lazyLoad) {
    fetchBook(bookTitle)
        .then(({lastRead}) => {
            if (!lazyLoad) {
                showLoader();
            }
            const loadChapterPromise = getAndRenderChapter(bookTitle, lastRead, true);
            loadChapterPromise
                .catch((error) => {
                    console.error(error);
                    showSnackbar("Error: " + error.message);
                })
                .finally(() => {
                    if (!lazyLoad) {
                        hideLoader();
                    }
                });
        })
}