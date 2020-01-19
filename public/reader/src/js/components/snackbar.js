export function showSnackbar(message) {
    if (!message) {
        return
    }
    const snackbar = document.createElement("div");
    snackbar.classList.add("show", "snackbar");
    snackbar.textContent = message;
    document.body.appendChild(snackbar);
    setTimeout(function () {
        document.body.removeChild(snackbar)
    }, 3000);
}
