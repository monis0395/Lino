import { getTitle } from "../components/book-title.js";

export function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength) * 100;
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1[i - 1] !== s2[j - 1]) {
                        newValue = Math.min(
                            Math.min(newValue, lastValue),
                            costs[j]
                        ) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) {
            costs[s2.length] = lastValue;
        }
    }
    return costs[s2.length];
}

export function getSanitizedChapterName(chapterName, domain) {
    const bookTitle = getTitle(window.bookReader.bookTitle, domain);
    if (chapterName.startsWith(bookTitle)) {
        chapterName = chapterName.replace(bookTitle, "").trim();
    }
    if (chapterName.toLowerCase().startsWith("chapter")
        && chapterName.length > ("chapter".length + 10)) {
        let lowerCaseChapter = chapterName.toLowerCase();
        const start = lowerCaseChapter.indexOf("chapter") + "chapter".length;
        let i = start;
        for (; i < lowerCaseChapter.length; i++) {
            const char = lowerCaseChapter.charAt(i);
            if (isLetter(char)) {
                break
            }
        }
        const sanitizedName = getSanitizedChapterName(chapterName.substring(i), domain);
        return sanitizedName;
    } else {
        return chapterName;
    }
}

function isLetter(char) {
    return char.toUpperCase() !== char.toLowerCase();
}
