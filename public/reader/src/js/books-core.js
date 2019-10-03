import { getBooks } from "./books-store.js";
import { addBookInit } from "./add-book.js";

const bookTemplateBlock = `
    <div class='book'>
        <a href="$book_link$">
            <span class="book-title">$book_title$</span>
            <span class="book-domain">$book_domain$</span>
        </a>
    </div>`;


function loadBooks() {
    const page = document.getElementsByClassName('page')[0];
    getBooks().then((books) => {
        books.forEach((book) => {
            const dummyDiv = document.createElement('div');
            const hostname = new URL(book.url).hostname;
            dummyDiv.innerHTML = bookTemplateBlock
                .replace('$book_title$', book.title)
                .replace('$book_domain$', hostname)
                .replace('$book_link$', book.link);
            page.appendChild(dummyDiv);
        })
    });
}

function init() {
    addBookInit();
    loadBooks();
}

init();