export function loadModal() {
    loadAddLinkModal();
}

function loadAddLinkModal() {
    const modal = document.getElementById("add-link-modal");
    attachModalTrigger(modal);
    attachModalClose(modal);
}

function attachModalTrigger(modal) {
    const addLink = document.getElementById("add-link-btn");
    addLink.onclick = () => {
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