import { fetchBook, storeOrUpdateBook } from "../book/books-store.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { addFinToPage, getAllChaptersRendered, removeChapter } from "./chapter-rendering.js";
import { updateListSelection } from "./chapter-list.js";
import { debounce, findFirstVisibleElement, getElementByXpath, getPathTo, getVisibilityForElement, throttle } from "../util/dom-util.js";
import { storeChapter } from "./chapter-store.js";
import { updateInfoChapterName, updateProgressBar } from "../components/chapter-info-bar.js";
import { getChapterLink } from "../components/chapter-url.js";
import { getChapterElement } from "./chapter-rendering.js";

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
    }
    if (mode === "debounce") {
        loadNextChapter(chapterNumber);
        removeChapter(chapterNumber - 2);
    }
    updateInfoChapterName(chapterElement);
    updateChapterProgress(chapterNumber, chapterElement);
    onFirstVisibleChapter.lastChapterFound = chapterNumber;
}

function updateLastRead(chapterNumber) {
    const bookTitle = window.bookReader.bookTitle;
    const chapterLink = getChapterLink(bookTitle, chapterNumber);
    window.history.replaceState({}, bookTitle, chapterLink);
    storeOrUpdateBook(bookTitle, {
        lastRead: chapterNumber,
        lastReadTimestamp: Date.now(),
    });
    console.log("updated last read to", chapterNumber);
}

function loadNextChapter(chapterNumber) {
    const nextChapterNumber = chapterNumber + 1;
    const chapterElement = getChapterElement(nextChapterNumber);
    if (chapterElement) {
        return;
    }
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

function updateChapterProgress(chapterNumber, chapterElement) {
    const firstVisibleElement = findFirstVisibleElement(chapterElement);
    if (firstVisibleElement) {
        updateXpath(chapterNumber, firstVisibleElement);
        const value = firstVisibleElement.offsetTop - chapterElement.offsetTop;
        updateProgressBar(value, chapterElement.scrollHeight)
    }
}

function updateXpath(chapterNumber, firstVisibleElement) {
    let finalXpath;
    const xpath = getPathTo(firstVisibleElement);
    const element = getElementByXpath(xpath);
    if (element === firstVisibleElement) {
        finalXpath = xpath;
        // console.log("xpath", finalXpath, "path 2")
    }

    if (finalXpath) {
        const bookTitle = window.bookReader.bookTitle;
        fetchBook(bookTitle)
            .then((book) => {
                const chapter = book.chapters[chapterNumber];
                storeChapter(chapter.link, {
                    lastReadElementXpath: finalXpath,
                })
            });
    } else {
        console.log("no correct xpath found")
    }
}


export function initChapterListener() {
    window.addEventListener('scroll', debounce(onScrollDebounce, 1000), {passive: true});
    window.addEventListener('scroll', throttle(onScrollThrottle, 100), {passive: true});
}