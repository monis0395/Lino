import { getBooks } from "./books-store.js";
import { removeChild } from "../util/dom-util.js";
import { getChapterLink } from "../components/chapter-url.js";
import { getTitle } from "../components/book-title.js";
import "./book-menu.js";

// three dots https://codepen.io/ryanmorr/pen/vLKvqe
const bookTemplateBlock = `
    <div class='book' id="__book_id__">
        <a href="__book_link__">
            <div class="book-title">
                <h5>__book_title__</h5>
                <div class="book-menu">
                    <button class="book-menu-btn">⠇</button>
                    <div class="book-menu-content">
                    <li>
                        <a href="__book_link__">Open</a>
                    </li>
                    <li onclick="deleteBook('__book_id__')">Delete</li>
                    </div>
                </div>
            </div>
            <div class="book-domain">__book_domain__
                <span style="float: right">__last_read__ of __total_chapter__ read</span>
            </div>
        </a>
    </div>`;

export function addBookToPage(book) {
    if (!book || !book.title) {
        return
    }
    const page = document.getElementsByClassName('page')[0];

    const bookElement = document.createElement('div');
    const hostname = new URL(book.url).hostname;
    bookElement.innerHTML = bookTemplateBlock
        .replace(/__book_id__/g, book.title)
        .replace(/__book_title__/g, getTitle(book.title, hostname))
        .replace(/__book_domain__/g, hostname)
        .replace(/__last_read__/g, (book.lastRead || 0) + 1)
        .replace(/__total_chapter__/g, book.chapters.length)
        .replace(/__book_link__/g, getChapterLink(book.title, book.lastRead));

    let oldBookElement = document.getElementById(book.title);
    if (oldBookElement) {
        oldBookElement.parentElement.replaceChild(bookElement.firstElementChild, oldBookElement)
    } else {
        page.appendChild(bookElement.firstElementChild);
    }
}

function deleteAllBooks() {
    const books = document.querySelectorAll(".book");
    Array.from(books).forEach(removeChild)
}

function compare(aBook, bBook) {
    const bTimeStamp = bBook.lastReadTimestamp || 0;
    const aTimeStamp = aBook.lastReadTimestamp || 0;
    return bTimeStamp - aTimeStamp;
}

export function loadBooks() {
    return getBooks().then((books) => books.sort(compare).forEach(addBookToPage));
}

export function reloadBooks() {
    deleteAllBooks();
    return loadBooks();
}
