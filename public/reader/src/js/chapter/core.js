import { loadChapter } from "./load-chapter.js";

function getBookTitle() {
    const search = new URLSearchParams(window.location.search);
    return search.get("book");
}

function getChapterNumber() {
    const search = new URLSearchParams(window.location.search);
    return parseInt(search.get("chapter"), 10);
}

function init() {
    const bookTitle = getBookTitle();
    window.bookReader = {bookTitle};
    loadChapter(bookTitle, getChapterNumber())
}

init();