export function loadAnyModal(modal, modalTrigger) {
    attachModalTrigger(modal,modalTrigger);
    attachModalClose(modal)
}

function attachModalTrigger(modal, modalTrigger) {
    modalTrigger.onclick = () => {
        modal.style.display = "block";
    };
}

function attachModalClose(modal) {
    const close = modal.getElementsByClassName("close")[0];
    close.onclick = () => {
        modal.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}