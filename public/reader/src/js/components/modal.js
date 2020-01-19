import { hideElement, showElement } from "../util/dom-util.js";

export function loadAnyModal(modal, modalBtn) {
    attachModalTrigger(modal, modalBtn);
    attachModalClose(modal)
}

function attachModalTrigger(modal, modalBtn) {
    modalBtn.onclick = () => showElement(modal);
}

function attachModalClose(modal) {
    const close = modal.getElementsByClassName("close")[0];
    if (close) {
        close.onclick = () => hideElement(modal);
    }
    window.onclick = function (event) {
        if (event.target === modal) {
            hideElement(modal);
        }
    };
}