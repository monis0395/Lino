import { loadAnyModal } from "./modal.js";

function loadAddLinkModal() {
    const modal = document.getElementById("add-link-modal");
    const addLink = document.getElementById("add-link-btn");
    loadAnyModal(modal, addLink)
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

export function addLinkInit() {
    loadAddLinkModal();
    handleSubmitBtn();
}