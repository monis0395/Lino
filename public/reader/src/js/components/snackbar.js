export function showSnackbar(message) {
    if (!message) {
        return
    }
    const snackbar = document.createElement("div");
    snackbar.id = "snackbar";
    snackbar.classList.add("show");
    snackbar.innerText = message;
    document.body.appendChild(snackbar);
    setTimeout(function () {
        // snackbar.classList.remove("show");
        document.body.removeChild(snackbar)
    }, 3000);
}