import { fetchBook } from "../book/books-store.js";
import { getChapterLink } from "../components/chapter-url.js";
import { isDescendant } from "../util/dom-util.js";

const chaptersList = document.getElementById("chapters-list");
const templateBlock = `
<a id="chapter-index-__chapter_number__" href="__chapter_link__">
    <div class="title">__chapter_title__</div>
</a>
`;

function updateListSelection(lastReadChapterIndex) {
    const list = document.getElementById("chapters-list"),
        targetLi = document.getElementById(`chapter-index-${lastReadChapterIndex}`);
    targetLi.firstElementChild.classList.add("selected");
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
                const dummyDiv = document.createElement("div");
                dummyDiv.innerHTML = templateBlock
                    .replace(/__chapter_number__/g, index + 1)
                    .replace(/__chapter_link__/g, chapterLink)
                    .replace(/__chapter_title__/g, chapter.title);
                chaptersList.appendChild(dummyDiv.firstElementChild);
            });
            updateListSelection(lastRead + 1)
        });
    attachChapterListBtnListener();
}