import { fetchBook } from "../book/books-store.js";
import { getChapter } from "./get-chapter.js";
import { addChapterToPage } from "./chapter-rendering.js";

const loadedChaptersMap = {};

export function getAndRenderChapter(bookTitle, chapterNumber = 0) {
    let chapterTitle = "";
    const promise = fetchBook(bookTitle)
        .then(({chapters}) => {
            const chapter = chapters[chapterNumber];
            chapterTitle = chapter.title;
            return getChapter(chapter.link)
        })
        .then((chapter) => {
            addChapterToPage(chapter, chapterNumber, chapterTitle);
            loadedChaptersMap[chapterNumber] = true;
            console.log("rendered chapter", chapterNumber);
        });
    promise.catch(console.error);
    return promise;
}