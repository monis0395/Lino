import { loadAnyModal } from "../components/modal.js";
import { storeBook } from "./books-store.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { hideElement } from "../util/dom-util.js";
import { showSnackbar } from "../components/snackbar.js";
import { requestBook } from "./request-book.js";
import { reloadBooks } from "./books-rendering.js";

const modal = document.getElementById("add-book-modal");
const addBookBtn = document.getElementById("add-book-modal-btn");

export function addBookInit() {
    loadAnyModal(modal, addBookBtn);
    attachOnClickOnSubmit();
}

function attachOnClickOnSubmit() {
    const submit = document.getElementById("add-book-modal-submit");
    submit.onclick = onSubmit;
}

function onSubmit(event) {
    event.preventDefault();
    const linkElement = document.getElementById("add-book-modal-input");
    const link = linkElement.value;
    hideElement(modal);
    showLoader();
    requestBook(link)
        .then(getBookResolved)
        .catch(getBookRejected)
        .finally(hideLoader);
}

function getBookResolved(book) {
    if (book && book.title) {
        storeBook(book.title, book);
        reloadBooks();
        showSnackbar(`Added book: ${book.title}`);
    }
}

function getBookRejected(error) {
    if (error && error.error) {
        showSnackbar(`Error: ` + error.error.message);
    } else {
        showSnackbar(`Error: ` + error);
    }
}
