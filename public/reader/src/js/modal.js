export function loadAnyModal(modal, modalBtn) {
    attachModalTrigger(modal,modalBtn);
    attachModalClose(modal)
}

function attachModalTrigger(modal, modalBtn) {
    modalBtn.onclick = () => {
        modal.style.display = "block";
    };
}

export function hideModal(modal) {
    modal.style.display = "none";
}

function attachModalClose(modal) {
    const close = modal.getElementsByClassName("close")[0];
    close.onclick = () => hideModal(modal);
    window.onclick = function (event) {
        if (event.target === modal) {
            hideModal(modal);
        }
    };
}