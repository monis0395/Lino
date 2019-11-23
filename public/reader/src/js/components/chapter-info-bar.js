const progressBarElement = document.getElementById("info-chapter-progress-bar");
// const progressElement = document.getElementById("info-total-progress");

export function updateProgressBar(value, max) {
    const percentage = Math.floor(value / max * 100);
    if (percentage > 100 || percentage < 0) {
        console.log("percentage", percentage)
    }
    const pvalue = `${percentage}%`;
    progressBarElement.style.width = pvalue;
    // progressElement.innerText = `${pvalue}`;
}

const infoChapterName = document.getElementById("info-chapter-name");

export function updateInfoChapterName(chapterElement) {
    const chapterName = chapterElement.querySelector(".chapter-title").innerText;
    infoChapterName.innerText = chapterName;
}