export function loadAnyModal(modal, modalBtn) {
    attachModalTrigger(modal,modalBtn);
    attachModalClose(modal)
}

function attachModalTrigger(modal, modalBtn) {
    modalBtn.onclick = () => {
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