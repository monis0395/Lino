import { fetchBook, storeBook } from "../book/books-store.js";
import { getAndRenderChapter } from "./load-chapter.js";

const thresholdSet = [];
for (let i = 0; i <= 1.0; i += 0.01) {
    thresholdSet.push(i);
}

let lastReadChapterObserver = new IntersectionObserver(updateLastRead, {
    threshold: thresholdSet,
});

let halfReadObserver = new IntersectionObserver(loadNextChapter, {
    threshold: thresholdSet,
});

const chapterList = {};

export function attachObserversFor(element) {
    const chapterNumber = parseInt(element.dataset.chapternumber, 10);
    chapterList[chapterNumber] = true;

    // lastReadChapterObserver.observe(element);
    // halfReadObserver.observe(element);
}

function updateLastRead(entries, observer) {
    entries.forEach(entry => {
        if (!entry) {
            return;
        }
        let visiblePct = (Math.floor(entry.intersectionRatio * 100));
        if (visiblePct > 10 || !entry.isVisible) {
            return;
        }
        const target = entry.target;
        lastReadChapterObserver.unobserve(target);
        const chapterNumber = parseInt(target.dataset.chapternumber, 10);
        if (!chapterNumber) {
            return;
        }
        if (chapterNumber > 5) {
            return;
        }
        const bookTitle = window.bookReader.bookTitle;
        fetchBook(bookTitle)
            .then((book) => {
                storeBook(bookTitle, {
                    ...book,
                    lastRead: chapterNumber,
                })
            })
    });
}


function loadNextChapter(entries, observer) {
    entries.forEach(entry => {
        if (!entry) {
            return;
        }
        let visiblePct = (Math.floor(entry.intersectionRatio * 100));
        console.log("loadNextChapter visiblePct", visiblePct, entry.intersectionRatio, entry.isVisible);
        if (visiblePct <= 50) {
            return;
        }
        console.log("visiblePct", visiblePct);
        const target = entry.target;
        halfReadObserver.unobserve(target);
        const chapterNumber = parseInt(target.dataset.chapternumber, 10);
        console.log("chapter number", chapterNumber);
        const nextChapterNumber = chapterNumber + 1;
        const bookTitle = window.bookReader.bookTitle;
        const nextChapterLoaded = chapterList[nextChapterNumber];
        if (nextChapterLoaded) {
            return;
        }
        if (nextChapterNumber > 5) {
            return;
        }
        chapterList[nextChapterNumber] = true;
        fetchBook(bookTitle)
            .then((book) => {
                const totalChapters = book.chapters.length;
                if (nextChapterNumber < totalChapters) {
                    getAndRenderChapter(bookTitle, nextChapterNumber)
                }
            })
    })
}




