import { loadModal } from "./modal.js";

const bookTemplateBlock = `
    <div class='book'>
        <a href="$book_link$">
            <span class="book-title">$book_title$</span>
            <span class="book-author">$book_author$</span>
        </a>
    </div>`;

function getBooks() {
    const books = [];
    for (let i = 0; i < 4; i++) {
        books.push({
            title: "Book Title",
            author: 'Author Name',
            link: "books.html"
        })
    }
    return books
}

function loadBooks() {
    const books = getBooks();
    const page = document.getElementsByClassName('page')[0];
    books.forEach((book) => {
        const dummyDiv = document.createElement('div');
        const bookElement = bookTemplateBlock
            .replace('$book_title$', book.title)
            .replace('$book_author$', book.author)
            .replace('$book_link$', book.link);
        dummyDiv.innerHTML = bookElement;
        page.appendChild(dummyDiv);
    })
}

function init() {
    loadModal();
    loadBooks();
}

init();