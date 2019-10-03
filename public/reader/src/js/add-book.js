import { loadAnyModal } from "./modal.js";
import { storeBook } from "./books-store.js";
import { addBookToPage } from "./books-rendering.js";

export function addBookInit() {
    loadAddBookModal();
    attachOnClickOnSubmit();
}

function loadAddBookModal() {
    const modal = document.getElementById("add-book-modal");
    const addBookBtn = document.getElementById("add-book-modal-btn");
    loadAnyModal(modal, addBookBtn)
}

function attachOnClickOnSubmit() {
    const submit = document.getElementById("add-book-modal-submit");
    submit.onclick = onSubmit;
}

function onSubmit(event) {
    event.preventDefault();
    const linkElement = document.getElementById("add-book-modal-input");
    const link = linkElement.value;
    getBook(link).then((book) => {
        storeBook(book.title, book);
        addBookToPage(book);
        console.log("book", book);
    });
    console.log("link submitted", link);
}

function getBook(link) {
    const api = "https://monis0395.api.stdlib.com/getBook@dev?url";
    return new Promise(function (resolve, reject) {
        fetch(api + encodeURIComponent(link))
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error))
    });
}