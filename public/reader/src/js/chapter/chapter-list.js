import { fetchBook } from "../book/books-store.js";
import { getChapterLink } from "../components/chapter-url.js";
import { isDescendant } from "../util/dom-util.js";

const chaptersList = document.getElementById("chapters-list");

function updateListSelection(lastReadChapterIndex) {
    const list = document.getElementById("chapters-list"),
        targetLi = document.getElementById(`chapter-index-${lastReadChapterIndex}`);
    targetLi.classList.add("selected");
    list.scrollTop = (targetLi.offsetTop - 50);
}

function attachChapterListBtnListener() {
    const chaptersListBtn = document.getElementById("chapters-list-btn");
    chaptersListBtn.onclick = (e) => {
        e.preventDefault();
        chaptersList.style.left = "0";
        window.onclick = function (event) {
            if (event.target !== chaptersListBtn
                && !isDescendant(chaptersList, event.target)) {
                chaptersList.style.left = "-90vw";
            }
        };
    }
}

export function loadChapterList() {
    const bookTitle = window.bookReader.bookTitle;
    fetchBook(bookTitle)
        .then(({chapters, lastRead}) => {
            chapters.forEach((chapter, index) => {
                const chapterLink = getChapterLink(bookTitle, index);
                const chapterAnchorTag = document.createElement("a");
                chapterAnchorTag.href = chapterLink;
                chapterAnchorTag.id = `chapter-index-${index}`;
                chapterAnchorTag.innerText = `${index + 1}. ${chapter.title}`;
                chaptersList.appendChild(chapterAnchorTag);
            });
            updateListSelection(lastRead)
        });
    attachChapterListBtnListener();
}