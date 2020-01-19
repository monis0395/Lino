const progressBarElement = document.getElementById("info-chapter-progress-bar");
const progressElement = document.getElementById("info-total-progress");

export function updateProgressBar(value, max) {
    let percentage = value / max * 100;
    if (percentage > 100 || percentage < 0) {
        console.log("percentage", percentage);
        percentage = 0;
    }
    progressBarElement.style.width = `${percentage.toFixed(2)}%`;
    let pvalue = percentage.toFixed(1).toString();
    pvalue = pvalue < 10 ? '0' + pvalue : pvalue;
    progressElement.textContent = `${pvalue}%`;
}

const infoChapterName = document.getElementById("info-chapter-name");

export function updateInfoChapterName(chapterElement) {
    const chapterName = chapterElement.dataset["chaptertitle"];
    infoChapterName.textContent = chapterName;
}

function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const infoTime = document.getElementById("info-time");

function updateTime() {
    const today = new Date();
    infoTime.textContent = formatAMPM(today);
}

updateTime();
setInterval(updateTime, 1e3 * 60);
