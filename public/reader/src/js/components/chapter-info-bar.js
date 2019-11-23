const progressBarElement = document.getElementById("info-chapter-progress-bar");
const progressElement = document.getElementById("info-total-progress");

export function updateProgressBar(value, max) {
    const percentage = value / max * 100;
    if (percentage > 100 || percentage < 0) {
        console.log("percentage", percentage)
    }
    progressBarElement.style.width = `${percentage.toFixed(2)}%`;
    progressElement.innerText = `${percentage.toFixed(1)}%`;
}

const infoChapterName = document.getElementById("info-chapter-name");

export function updateInfoChapterName(chapterElement) {
    const chapterName = chapterElement.querySelector(".chapter-title").innerText;
    infoChapterName.innerText = chapterName;
}


export function updateTotalProgress(chapterNumber) {
    // const bookTitle = window.bookReader.bookTitle;
    // fetchBook(bookTitle)
    //     .then((book) => {
    //         const totalChapters = book.chapters.length;
    //         const percentage = chapterNumber / totalChapters * 100;
    //         progressElement.innerText = `${percentage.toFixed(1)}%`;
    //     })
}