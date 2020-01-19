import { fetchBook } from "./books-store.js";
import { showSnackbar } from "../components/snackbar.js";
import { deleteBookElement } from "./books-rendering.js";
import { removeChapter } from "../chapter/chapter-store.js";
import { removeBook } from "./books-store.js";

window.deleteBook = function deleteBook(bookID, bookTitle) {
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
        .finally(() => showSnackbar(`Deleted Book ${bookTitle}`))
};


function showErrorMessage(error) {
    if (error && error.error) {
        showSnackbar(`Error: ` + error.error.message);
    } else {
        showSnackbar(`Error: ` + error);
    }
}
