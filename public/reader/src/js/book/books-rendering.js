import { getBooks } from "./books-store.js";
import { removeChild } from "../util/dom-util.js";
import { getChapterLink } from "../components/chapter-url.js";

const bookTemplateBlock = `
    <div class='book'>
        <span class="three-dot">⠇</span>
        <a href="__book_link__">
            <span class="book-title">__book_title__</span>
            <span class="book-domain">__book_domain__
                <span style="float: right">__last_read__ of __total_chapter__ read</span>
            </span>
        </a>
    </div>`;

export function addBookToPage(book) {
    if (!book.title) {
        return
    }
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    const hostname = new URL(book.url).hostname;
    dummyDiv.innerHTML = bookTemplateBlock
        .replace(/__book_title__/g, book.title)
        .replace(/__book_domain__/g, hostname)
        .replace(/__last_read__/g, book.lastRead + 1)
        .replace(/__total_chapter__/g, book.chapters.length)
        .replace(/__book_link__/g, getChapterLink(book.title, book.lastRead));
    page.appendChild(dummyDiv.firstElementChild);
}

function deleteAllBooks() {
    const books = document.querySelectorAll(".book");
    Array.from(books).forEach(removeChild)
}

export function loadBooks() {
    return getBooks().then((books) => books.forEach(addBookToPage));
}

export function reloadBooks() {
    deleteAllBooks();
    return loadBooks();
}