import { loadAnyModal } from "../components/modal.js";
import { storeBook } from "./books-store.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { hideElement } from "../util/dom-util.js";
import { showSnackbar } from "../components/snackbar.js";
import { requestFor } from "../components/request-for.js";
import { reloadBooks } from "./books-rendering.js";

const modal = document.getElementById("add-book-modal");
const addBookBtn = document.getElementById("add-book-modal-btn");
const getBook = "https://monis0395.api.stdlib.com/getBook@dev?url=";
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
    requestFor(getBook, link)
        .then(getBookResolved)
        .catch(getBookRejected)
        .finally(hideLoader);
}

function getBookResolved(book) {
    if (book && book.title) {
        storeBook(book.title, book).then(reloadBooks);
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
