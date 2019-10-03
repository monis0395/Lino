export function showSnackbar(message) {
    if (!message) {
        return
    }
    const snackbar = document.createElement("div");
    snackbar.classList.add("show", "snackbar");
    snackbar.innerText = message;
    document.body.appendChild(snackbar);
    setTimeout(function () {
        document.body.removeChild(snackbar)
    }, 3000);
}