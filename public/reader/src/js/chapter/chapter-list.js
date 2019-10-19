import { fetchBook } from "../book/books-store.js";
import { getChapterLink } from "../components/chapter-url.js";

function updateListSelection(lastReadChapterIndex) {
    const list = document.getElementById("chapters-list"),
        targetLi = document.getElementById(`chapter-index-${lastReadChapterIndex}`);
    targetLi.classList.add("selected");
    list.scrollTop = (targetLi.offsetTop - 50);
}

export function loadChapterList() {
    const chaptersList = document.getElementById("chapters-list");
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
        })
}