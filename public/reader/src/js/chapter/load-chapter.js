import { fetchBook } from "../book/books-store.js";
import { getChapter } from "./get-chapter.js";
import { addChapterToPage } from "./chapter-rendering.js";

const loadedChaptersMap = {};

export function getAndRenderChapter(bookTitle, chapterNumber = 0) {
    if (loadedChaptersMap[chapterNumber]) {
        return Promise.resolve(true);
    }
    return fetchBook(bookTitle)
        .then(({chapters}) => getChapter(chapters[chapterNumber].link))
        .then((chapter) => {
            addChapterToPage(chapter, chapterNumber);
            loadedChaptersMap[chapterNumber] = true;
            console.log("rendered chapter", chapterNumber);
        })
        .catch(console.error);
}