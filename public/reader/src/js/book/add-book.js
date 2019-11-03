import { loadAnyModal } from "../components/modal.js";
import { hideElement } from "../util/dom-util.js";
import { getBook } from "./get-book.js";

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
    const chaptersInReverse = document.getElementById("chapter-order-reverse");
    const link = linkElement.value;
    hideElement(modal);
    getBook(link, chaptersInReverse.checked)
}