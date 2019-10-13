import { removeChild } from "../util/dom-util.js";
import { attachObserversFor } from "./chapter-listener.js";

const chapterTemplateBlock = `
    <div class='chapter chapter-__chapter_number__' data-chapterNumber="__chapter_number__">
        <span class="chapter-title">__chapter_title__</span>
        <span class="chapter-domain">
        <a href="__chapter_link__" title="Chapter's source">
        __chapter_domain__
        </a></span>
        <div class="chapter-content">__chapter_content__</div>
    </div>
`;

export function addChapterToPage(chapter, chapterNumber, chapterTitle) {
    if (!chapter.title) {
        return
    }
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    const hostname = new URL(chapter.url).hostname;
    dummyDiv.innerHTML = chapterTemplateBlock
        .replace(/__chapter_number__/g, chapterNumber)
        .replace(/__chapter_link__/g, chapter.url)
        .replace(/__chapter_title__/g, chapter.title || chapterTitle)
        .replace(/__chapter_domain__/g, hostname)
        .replace(/__chapter_content__/g, filterContent(chapter));
    page.appendChild(dummyDiv.firstElementChild);
    attachObserversFor(document.getElementsByClassName("chapter-" + chapterNumber)[0])
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

const finBlock = `<div id="fin">Fin<br><br>(You have caught up with the latest chapter)</div>`;

export function addFinToPage() {
    if (addFinToPage.done) {
        return;
    }
    addFinToPage.done = true;
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = finBlock;
    page.appendChild(dummyDiv);
}