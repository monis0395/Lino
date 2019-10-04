import { getBooks } from "./books-store.js";
import { removeChild } from "../util/dom-util.js";

const bookTemplateBlock = `
    <div class='book'>
        <a href="$book_link$">
            <span class="book-title">$book_title$</span>
            <span class="book-domain">$book_domain$</span>
        </a>
    </div>`;

function getChapterLink(book) {
    const baseURL = "./chapter.html?";
    const queryString = new URLSearchParams();
    queryString.append("book", book.title);
    queryString.append("chapter", book.lastRead || 0);
    return baseURL + queryString.toString();
}

export function addBookToPage(book) {
    if (!book.title) {
        return
    }
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    const hostname = new URL(book.url).hostname;
    dummyDiv.innerHTML = bookTemplateBlock
        .replace('$book_title$', book.title)
        .replace('$book_domain$', hostname)
        .replace('$book_link$', getChapterLink(book));
    page.appendChild(dummyDiv);
}

function deleteAllBooks() {
    const books = document.querySelectorAll(".book");
    Array.from(books).forEach(removeChild)
}

export function loadBooks() {
    getBooks().then((books) => books.forEach(addBookToPage));
}

export function reloadBooks() {
    deleteAllBooks();
    loadBooks();
}