import { fetchBook, storeOrUpdateBook } from "../book/books-store.js";
import { getChapterLink } from "../components/chapter-url.js";
import { isDescendant, scrollToElement } from "../util/dom-util.js";
import { getChapterElement, removeChaptersExcept, removeFin } from "./chapter-rendering.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { getAndRenderChapter } from "./load-chapter.js";
import { showSnackbar } from "../components/snackbar.js";

const chaptersList = document.getElementById("chapters-list");
const selectedClassName = "selected";
const templateBlock = `
<li id="chapter-index-__chapter_number__" onclick="window.chapterClicked(__chapter_number__)">
    __chapter_title__
</li>
`;

window.chapterClicked = (chapterNumber) => {
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
                    chapterElement.scrollIntoView();
                }
            })
            .catch((error) => {
                console.error(error);
                showSnackbar("Error: " + error.message)
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
        if (selected) {
            selected.classList.remove(selectedClassName);
        }
        targetLi.classList.add(selectedClassName);
        console.log("update chapters index list to", lastReadChapterIndex);
        scrollToElement(targetLi, chaptersList);
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
            chaptersList.appendChild(chapterListUl);
            chapters.forEach((chapter, index) => {
                const chapterLink = getChapterLink(bookTitle, index);
                const dummyDiv = document.createElement("div");
                dummyDiv.innerHTML = templateBlock
                    .replace(/__chapter_number__/g, index)
                    .replace(/__chapter_link__/g, chapterLink)
                    .replace(/__chapter_title__/g, chapter.title);
                chapterListUl.appendChild(dummyDiv.firstElementChild);
            });
            updateListSelection(lastRead)
        });
    attachChapterListBtnListener();
}