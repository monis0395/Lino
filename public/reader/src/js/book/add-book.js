import { loadAnyModal } from "../components/modal.js";
import { storeBook } from "./books-store.js";
import { addBookToPage } from "./books-rendering.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { isValidURL } from "../util/url-util.js";
import { hideElement } from "../util/dom-util.js";

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
    hideElement(modal);
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