import { fetchBook, storeOrUpdateBook } from "../book/books-store.js";
import { getChapterLink } from "../components/chapter-url.js";
import { isDescendant, scrollToElement } from "../util/dom-util.js";
import { getChapterElement, removeChaptersExcept, removeFin } from "./chapter-rendering.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { showSnackbar } from "../components/snackbar.js";
import { updateInfoChapterName } from "../components/chapter-info-bar.js";
import { getSanitizedChapterName } from "../util/string-util.js";

const chaptersList = document.getElementById("chapters-list");
const selectedClassName = "selected";

function chapterClicked(chapterNumber) {
    console.log("chapter clicked", chapterNumber);
    hideChaptersList();
    showLoader();
    const bookTitle = window.bookReader.bookTitle;
    updateLastRead(bookTitle, chapterNumber).then(() => {
        updateListSelection(chapterNumber);
        const chapterLink = getChapterLink(bookTitle, chapterNumber);
        window.history.replaceState({}, bookTitle, chapterLink);
        getAndRenderChapter(bookTitle, chapterNumber)
            .then(() => {
                removeChaptersExcept(chapterNumber, [chapterNumber, chapterNumber + 1]);
                removeFin();
                const chapterElement = getChapterElement(chapterNumber);
                if (chapterElement) {
                    updateInfoChapterName(chapterElement);
                    chapterElement.scrollIntoView();
                }
            })
            .catch((error) => {
                if (window.navigator.onLine) {
                    console.error(error);
                    showSnackbar("Error: " + error.message)
                } else {
                    showSnackbar("You are offline! Please connect to internet!")
                }
            })
            .finally(hideLoader);

    });
};

function updateLastRead(bookTitle, chapterNumber) {
    return storeOrUpdateBook(bookTitle, {
        lastRead: chapterNumber,
        lastReadTimestamp: Date.now(),
    });
}

export function updateListSelection(lastReadChapterIndex) {
    const targetLi = document.getElementById(`chapter-index-${lastReadChapterIndex}`);
    if (targetLi) {
        const selected = document.querySelector('#chapters-list li.selected');
        if (targetLi === selected) {
            return;
        }
        if (selected) {
            selected.classList.remove(selectedClassName);
        }
        targetLi.classList.add(selectedClassName);
        console.log("update chapters index list to", lastReadChapterIndex);
        setTimeout(() => scrollToElement(targetLi, {block: "center"}), 1000);
    }
}

function hideChaptersList() {
    chaptersList.style.left = "-90vw";
}

function attachChapterListBtnListener() {
    const chaptersListBtn = document.getElementById("chapters-list-btn");
    chaptersListBtn.onclick = (e) => {
        e.preventDefault();
        chaptersList.style.left = "0";
        window.onclick = function (event) {
            if (event.target !== chaptersListBtn
                && !isDescendant(chaptersList, event.target)) {
                hideChaptersList();
            }
        };
    }
}

export function loadChapterList() {
    const bookTitle = window.bookReader.bookTitle;
    fetchBook(bookTitle)
        .then(({chapters, lastRead}) => {
            const chapterListUl = document.createElement("ul");
            chapters.forEach((chapter, index) => {
                const chapterTitle = getSanitizedChapterName(chapter.title);
                const li = document.createElement("li");
                li.id = `chapter-index-${index}`;
                li.textContent = `${index + 1}. ${chapterTitle}`;
                li.onclick = () => chapterClicked(index);
                chapterListUl.appendChild(li);
            });
            chaptersList.appendChild(chapterListUl);
            updateListSelection(lastRead);
        });
    attachChapterListBtnListener();
}
