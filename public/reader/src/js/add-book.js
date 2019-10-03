import { hideModal, loadAnyModal } from "./modal.js";
import { storeBook } from "./books-store.js";
import { addBookToPage } from "./books-rendering.js";
import { hideLoader, showLoader } from "./loader.js";
import { isValidURL } from "./url-util.js";

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
    showLoader();
    hideModal(modal);
    getBook(link)
        .finally(hideLoader)
        .catch(console.error)
        .then((book) => {
            if (book && book) {
                storeBook(book.title, book);
                addBookToPage(book);
            }
        });
}

function getBook(link) {
    const api = "https://monis0395.api.stdlib.com/getBook@dev?url=";
    return new Promise(function (resolve, reject) {
        if (!isValidURL(link)) {
            reject("invalid link");
            return
        }
        fetch(api + encodeURIComponent(link))
            .then(response => response.json().then(data => {
                if (response.ok) {
                    resolve(data)
                } else {
                    reject(data)
                }
            }))
            .catch(error => reject(error))
    });
}