const progressElement = document.getElementById("info-chapter-progress-bar");

export function updateProgressBar(value, max) {
    const percentage = Math.floor(value / max * 100);
    const pvalue = `${percentage}%`;
    progressElement.style.width = pvalue;
}

const infoChapterName = document.getElementById("info-chapter-name");

export function updateInfoChapterName(chapterElement) {
    const chapterName = chapterElement.querySelector(".chapter-title").innerText;
    infoChapterName.innerText = chapterName;
}