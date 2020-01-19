import { getBooks, storeOrUpdateBook } from "./books-store.js";
import { requestFor } from "../components/request-for.js";
import { showSnackbar } from "../components/snackbar.js";
import { addBookToPage } from "./books-rendering.js";

const apiGetBook = "https://monis0395.api.stdlib.com/getBook@dev/?url=";

function requestAndUpdateBook(book) {
    return requestFor(apiGetBook, book.url)
        .then((updatedBook) => {
            if (updatedBook && updatedBook.title) {
                if (book.chaptersInReverse) {
                    updatedBook.chapters = updatedBook.chapters.reverse()
                }
                return storeOrUpdateBook(updatedBook.title, updatedBook)
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
    showSnackbar(`Update started...`);
    const image = new Image();
    image.src = "https://monis0395.api.stdlib.com/getbook@dev/blank/";
    getBooks()
        .then((books) => {
            return Promise.all(books.map((book) => {
                return requestAndUpdateBook(book)
                    .then((updatedBook) => addBookToPage(updatedBook))
            }))
        })
        .catch((error) => {
            if (error && error.error) {
                showSnackbar(`Update Error: ` + error.error.message);
            } else {
                showSnackbar(`Update Error: ` + error);
            }
        })
        .finally(() => showSnackbar(`Updated books!`))
}

export function startCheckingForUpdates() {
    const updateInterval = 15 * 1000 * 60; // 15 minutes
    checkForUpdates();
    setInterval(checkForUpdates, updateInterval);
}
