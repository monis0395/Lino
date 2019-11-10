import { fetchBook, storeOrUpdateBook } from "../book/books-store.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { addFinToPage, getAllChaptersRendered, removeChapter } from "./chapter-rendering.js";
import { updateListSelection } from "./chapter-list.js";
import { debounce, findFirstVisibleElement, getElementXPath, getVisibilityForElement, throttle } from "../util/dom-util.js";
import { storeChapter } from "./chapter-store.js";

function onScrollDebounce() {
    processMaxVisibleChapter("debounce");
}

function onScrollThrottle() {
    processMaxVisibleChapter("throttle");
}

function processMaxVisibleChapter(mode) {
    const maxVisible = getMaxVisibleChapter();
    if (maxVisible && !isNaN(maxVisible.chapterNumber)) {
        onMaxVisibleChapter(maxVisible, mode);
    }
}

function getMaxVisibleChapter() {
    const chapters = getAllChaptersRendered();
    let maxVisible = undefined;
    let lastMaxVisibility = 0;
    Object.keys(chapters).forEach((chapterNumber) => {
        chapterNumber = parseInt(chapterNumber, 10);
        const chapterElement = chapters[chapterNumber];
        const visibility = getVisibilityForElement(chapterElement);
        if (visibility > lastMaxVisibility) {
            lastMaxVisibility = visibility;
            maxVisible = {
                chapterElement,
                chapterNumber,
            };
        }
    });
    return maxVisible;
}

function onMaxVisibleChapter({chapterNumber, chapterElement}, mode) {
    if (onMaxVisibleChapter.lastChapterFound !== chapterNumber) {
        updateListSelection(chapterNumber + 1);
        loadNextChapter(chapterNumber);
    }
    if (mode === "debounce") {
        removeChapter(chapterNumber - 2);
    }
    updateLastRead(chapterNumber);
    updateXpath(chapterNumber, chapterElement);
    onMaxVisibleChapter.lastChapterFound = chapterNumber;
}


function updateLastRead(chapterNumber) {
    storeOrUpdateBook(window.bookReader.bookTitle, {
        lastRead: chapterNumber,
        lastReadTimestamp: Date.now(),
    });
    console.log("updated last read to", chapterNumber);
}

function updateXpath(chapterNumber, chapterElement) {
    const bookTitle = window.bookReader.bookTitle;
    const firstVisibleElement = findFirstVisibleElement(chapterElement);

    fetchBook(bookTitle)
        .then((book) => {
            const chapter = book.chapters[chapterNumber];
            storeChapter(chapter.link, {
                lastReadElementXpath: getElementXPath(firstVisibleElement),
            })
        });
}

function loadNextChapter(chapterNumber) {
    const nextChapterNumber = chapterNumber + 1;
    const bookTitle = window.bookReader.bookTitle;
    console.log("loading next chapter", nextChapterNumber);
    fetchBook(bookTitle)
        .then((book) => {
            const totalChapters = book.chapters.length;
            if (nextChapterNumber < totalChapters) {
                getAndRenderChapter(bookTitle, nextChapterNumber).catch(console.error)
            } else {
                addFinToPage();
            }
        })
}


export function initChapterListener() {
    window.addEventListener('scroll', debounce(onScrollDebounce, 250), {passive: true});
    window.addEventListener('scroll', throttle(onScrollThrottle, 1000), {passive: true});
}