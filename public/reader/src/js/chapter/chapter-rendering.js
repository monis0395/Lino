import { removeChild } from "../util/dom-util.js";

const chapterTemplateBlock = `
    <div class='chapter' data-chapter-number="$chapter_number$">
        <span class="chapter-title">$chapter_title$</span>
        <span class="chapter-domain">$chapter_domain$</span>
        <br><br><br>
        <div class="chapter-content">$chapter_content$</div>
    </div>`;

export function addChapterToPage(chapter, chapterNumber, chapterTitle) {
    if (!chapter.title) {
        return
    }
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    const hostname = new URL(chapter.url).hostname;
    dummyDiv.innerHTML = chapterTemplateBlock
        .replace('$chapter_number$', chapterNumber)
        .replace('$chapter_title$', chapter.title || chapterTitle)
        .replace('$chapter_domain$', hostname)
        .replace('$chapter_content$', filterContent(chapter));
    page.appendChild(dummyDiv);
}

function filterContent(chapter) {
    const hostname = new URL(chapter.url).hostname;
    const content = document.createElement('div');
    content.innerHTML = chapter.content;
    Array.from(content.getElementsByTagName('a'))
        .forEach((anchorTag) => {
        if (isSourceWebsiteUrl(anchorTag, hostname) ||
            isIncorrectRelativeUrlFromSource(anchorTag)) {
            removeChild(anchorTag);
        }
    });
    return content.innerHTML;
}

function isSourceWebsiteUrl(anchorTag, hostname) {
    return anchorTag.hostname === hostname;
}

function isIncorrectRelativeUrlFromSource(anchorTag) {
    return anchorTag.hash === "" && anchorTag.hostname === window.location.hostname;
}

