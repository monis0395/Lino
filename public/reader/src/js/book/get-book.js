import { storeOrUpdateBook } from "./books-store.js";
import { hideLoader, showLoader } from "../components/loader.js";
import { showSnackbar } from "../components/snackbar.js";
import { requestFor } from "../components/request-for.js";
import { reloadBooks } from "./books-rendering.js";

const apiGetBook = "https://monis0395.api.stdlib.com/getBook@dev?url=";

export function getBook(link, reverse) {
    showLoader();
    requestFor(apiGetBook, link)
        .then((book) => storeBookAndShowSuccessMessage(book, reverse))
        .catch(showErrorMessage)
        .finally(hideLoader);
}

function storeBookAndShowSuccessMessage(book, reverse = false) {
    if (book && book.title) {
        if (reverse) {
            book.chapters = book.chapters.reverse()
        }
        storeOrUpdateBook(book.title, {
            ...book,
            chaptersInReverse: reverse,
        }).then(reloadBooks);
        showSnackbar(`Added book: ${book.title}`);
    } else {
        showSnackbar(`Book not found`);
    }
}

function showErrorMessage(error) {
    if (error && error.error) {
        showSnackbar(`Error: ` + error.error.message);
    } else {
        showSnackbar(`Error: ` + error);
    }
}
