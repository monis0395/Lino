import { fetchBook, storeOrUpdateBook } from "../book/books-store.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { addFinToPage, getAllChaptersRendered, getChapterElement, removeChapter } from "./chapter-rendering.js";
import { updateListSelection } from "./chapter-list.js";
import {
    clientHeight,
    debounce,
    findFirstVisibleElement,
    getElementByXpath,
    getPathTo,
    getScrollTop,
    getVisibilityForElement,
    throttle
} from "../util/dom-util.js";
import { storeChapter } from "./chapter-store.js";
import { updateInfoChapterName, updateProgressBar } from "../components/chapter-info-bar.js";
import { getChapterLink } from "../components/chapter-url.js";

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
        updateInfoChapterName(chapterElement);
        updateListSelection(chapterNumber);
        updateLastRead(chapterNumber);
        loadNextChapter(chapterNumber);
    }
    if (mode === "debounce") {
        removeChapter(chapterNumber - 2);
    }
    updateChapterProgress(chapterNumber, chapterElement, mode);
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
                getAndRenderChapter(bookTitle, nextChapterNumber)
                    .catch((e) => {
                        if (!window.navigator.onLine) {
                            console.log("offline status scheduling loading next chapter after 10 second");
                            setTimeout(() => loadNextChapter(chapterNumber), 10 * 1e3);
                        } else {
                            console.error(e)
                        }
                    })
            } else {
                addFinToPage();
            }
        })
}

const map = {};

function getChapterDimension(chapterNumber, chapterElement, dimension) {
    const now  = Date.now();
    const key = chapterNumber + dimension;
    map[key] = map[key] || {};
    const diff = now - map[key].now;
    if (diff < 1000) {
        return map[key].value;
    }
    const value = chapterElement[dimension];
    map[key] = {value, now};
    return value;
}

function updateChapterProgress(chapterNumber, chapterElement, mode) {
    const chapterOffsetTop = getChapterDimension(chapterNumber, chapterElement, "offsetTop");
    const chapterScrollHeight = getChapterDimension(chapterNumber, chapterElement, "scrollHeight");
    const value = getScrollTop() - chapterOffsetTop;
    updateProgressBar(value, chapterScrollHeight);
    if (mode === "debounce" && value > (clientHeight * 0.5)) {
        const firstVisibleElement = findFirstVisibleElement(chapterElement);
        if (firstVisibleElement) {
            updateXpath(chapterNumber, firstVisibleElement);
        }
    }
}

function updateXpath(chapterNumber, firstVisibleElement) {
    let finalXpath;
    const xpath = getPathTo(firstVisibleElement);
    const element = getElementByXpath(xpath);
    if (element === firstVisibleElement) {
        finalXpath = xpath;
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
    window.addEventListener('scroll', throttle(onScrollThrottle, 250), {passive: true});
}
