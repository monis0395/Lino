import { loadModal } from "./modal.js";
import { getBooks } from "./books-store.js";

const bookTemplateBlock = `
    <div class='book'>
        <a href="$book_link$">
            <span class="book-title">$book_title$</span>
            <span class="book-author">$book_author$</span>
        </a>
    </div>`;


function loadBooks() {
    const page = document.getElementsByClassName('page')[0];
    getBooks().then((books) => {
        books.forEach((book) => {
            if (!book) {
                return
            }
            console.log(book);
            const dummyDiv = document.createElement('div');
            const hostname = new URL(book.url).hostname;
            dummyDiv.innerHTML = bookTemplateBlock
                .replace('$book_title$', book.title)
                .replace('$book_author$', hostname)
                .replace('$book_link$', book.link);
            page.appendChild(dummyDiv);
        })
    });
}

function init() {
    loadModal();
    loadBooks();
}

init();