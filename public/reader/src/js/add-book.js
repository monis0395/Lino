import { loadAnyModal } from "./modal.js";

function loadAddBookModal() {
    const modal = document.getElementById("add-link-modal");
    const addBookBtn = document.getElementById("add-book-modal-btn");
    loadAnyModal(modal, addBookBtn)
}

function handleSubmitBtn() {
    const submit = document.getElementById("add-link-modal-submit");
    submit.onclick = (event) => {
        event.preventDefault();
        const linkElement = document.getElementById("add-link-modal-input");
        const link = linkElement.value;
        console.log("link submitted", link);
    }
}

export function addBookInit() {
    loadAddBookModal();
    handleSubmitBtn();
}