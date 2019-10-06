import { storeBook } from "./books-store.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { showSnackbar } from "../components/snackbar.js";
import { requestFor } from "../components/request-for.js";
import { reloadBooks } from "./books-rendering.js";

const apiGetBook = "https://monis0395.api.stdlib.com/getBook@dev?url=";

export function getBook(link) {
    showLoader();
    requestFor(apiGetBook, link)
        .then(storeBookAndShowSuccessMessage)
        .catch(showErrorMessage)
        .finally(hideLoader);
}

function storeBookAndShowSuccessMessage(book) {
    if (book && book.title) {
        storeBook(book.title, book).then(reloadBooks);
        showSnackbar(`Added book: ${book.title}`);
    }
}

function showErrorMessage(error) {
    if (error && error.error) {
        showSnackbar(`Error: ` + error.error.message);
    } else {
        showSnackbar(`Error: ` + error);
    }
}
