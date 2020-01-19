import { fetchBook, removeBook } from "./books-store.js";
import { showSnackbar } from "../components/snackbar.js";
import { deleteBookElement, getBookElement } from "./books-rendering.js";
import { removeChapter } from "../chapter/chapter-store.js";
import { decodeString } from "../util/string-util.js";

window.deleteBook = function deleteBook(bookID) {
    bookID = decodeString(bookID);
    const bookElement = getBookElement(bookID);
    const title = bookElement.dataset.title;
    fetchBook(bookID)
        .then((book) => {
            const chapters = book.chapters;
            const promises = chapters.map((chapter) => {
                const chapterID = chapter.link;
                return removeChapter(chapterID)
            });
            promises.push(removeBook(bookID));
            deleteBookElement(bookID);
            return Promise.all(promises);
        })
        .catch(showErrorMessage)
        .finally(() => showSnackbar(`Deleted Book ${title}`))
};


function showErrorMessage(error) {
    console.error("error", error);
    if (error && error.error) {
        showSnackbar(`Error: ` + error.error.message);
    } else {
        showSnackbar(`Error: ` + error);
    }
}
