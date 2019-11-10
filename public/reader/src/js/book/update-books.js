import { getBooks, storeOrUpdateBook } from "./books-store.js";
import { requestFor } from "../components/request-for.js";
import { reloadBooks } from "./books-rendering.js";
import { showSnackbar } from "../components/snackbar.js";
import { hideLoader, showLoader } from "../components/loader.js";

const apiGetBook = "https://monis0395.api.stdlib.com/getBook@dev/?url=";

function requestAndUpdateBook(book) {
    const oldTotalChapters = book.chapters.length;
    return requestFor(apiGetBook, book.url).then((updatedBook) => {
        const newTotalChapters = updatedBook.chapters.length;
        if (book.chaptersInReverse) {
            updatedBook.chapters = updatedBook.chapters.reverse()
        }
        if (updatedBook && updatedBook.title && newTotalChapters !== oldTotalChapters) {
            storeOrUpdateBook(updatedBook.title, {chapters: updatedBook.chapters})
        }
    });
}

function requestAndUpdateAllBooks(books) {
    return Promise.all(books.map((book) => requestAndUpdateBook(book)))
}

function checkForUpdates() {
    const update = Date.now();
    console.log("checking for updates", update);
    return getBooks()
        .then(requestAndUpdateAllBooks)
        .catch((error) => console.error("check for update error:", error, update))
        .finally(() => console.log("finished checking for update", update));
}

export function checkAndReloadBooks() {
    showLoader();
    checkForUpdates()
        .then(() => {
            showLoader();
            reloadBooks()
                .finally(hideLoader)
                .finally(() => showSnackbar(`Updated books!`));
        })
        .catch((error) => {
            if (error && error.error) {
                showSnackbar(`Update Error: ` + error.error.message);
            } else {
                showSnackbar(`Update Error: ` + error);
            }
        })
        .finally(hideLoader)
}

const updateInterval = 15 * 1000 * 60; // 15 minutes
checkForUpdates();
setInterval(checkForUpdates, updateInterval);
