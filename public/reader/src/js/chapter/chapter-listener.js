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
    const firstVisible = getFirstVisibleChapter();
    if (firstVisible && !isNaN(firstVisible.chapterNumber)) {
        onFirstVisibleChapter(firstVisible, mode);
    }
}

function getFirstVisibleChapter() {
    const chapters = getAllChaptersRendered();
    let firstVisible = undefined;
    Object.keys(chapters).forEach((chapterNumber) => {
        chapterNumber = parseInt(chapterNumber, 10);
        const chapterElement = chapters[chapterNumber];
        const visibility = getVisibilityForElement(chapterElement);
        if (visibility > 0 && !firstVisible) {
            firstVisible = {
                chapterElement,
                chapterNumber,
            };
        }
    });
    return firstVisible;
}

function onFirstVisibleChapter({chapterNumber, chapterElement}, mode) {
    if (onFirstVisibleChapter.lastChapterFound !== chapterNumber) {
        updateListSelection(chapterNumber);
        updateLastRead(chapterNumber);
        loadNextChapter(chapterNumber);
    }
    if (mode === "debounce") {
        removeChapter(chapterNumber - 2);
    }
    updateXpath(chapterNumber, chapterElement);
    onFirstVisibleChapter.lastChapterFound = chapterNumber;
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