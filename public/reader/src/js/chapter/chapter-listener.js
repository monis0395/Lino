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


export function attachObserversFor(element) {
    lastReadChapterObserver.observe(element);
    halfReadObserver.observe(element);
}

const visiblePercentageMap = {};

function updateLastRead(entries) {
    entries.forEach(entry => {
        const {intersectionRatio, target} = entry;
        const chapterNumber = parseInt(target.dataset.chapternumber, 10);
        if (!chapterNumber) {
            return;
        }
        const visibility = Math.floor(intersectionRatio * 100);
        const previousVisibility = visiblePercentageMap[chapterNumber];
        const visibilityIncreased = previousVisibility < visibility;
        if (!visibilityIncreased || !visibility) {
            visiblePercentageMap[chapterNumber] = visibility;
            return;
        }
        lastReadChapterObserver.unobserve(target);
        const bookTitle = window.bookReader.bookTitle;
        fetchBook(bookTitle)
            .then((book) => {
                console.log("updated last read to", chapterNumber);
                storeBook(bookTitle, {
                    ...book,
                    lastRead: chapterNumber,
                })
            })
    });
}

function loadNextChapter(entries) {
    entries.forEach(entry => {
        const {intersectionRatio, target} = entry;
        const chapterNumber = parseInt(target.dataset.chapternumber, 10);
        if (!chapterNumber) {
            return;
        }
        let visiblePercentage = Math.floor(intersectionRatio * 100);
        if (visiblePercentage === 0) {
            return;
        }
        halfReadObserver.unobserve(target);
        const nextChapterNumber = chapterNumber + 1;
        const bookTitle = window.bookReader.bookTitle;
        console.log("loading next chapter", nextChapterNumber);
        fetchBook(bookTitle)
            .then((book) => {
                const totalChapters = book.chapters.length;
                if (nextChapterNumber < totalChapters) {
                    getAndRenderChapter(bookTitle, nextChapterNumber)
                }
            })
    })
}




