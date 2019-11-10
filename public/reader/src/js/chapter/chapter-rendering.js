import { removeChild } from "../util/dom-util.js";
import { attachObserversFor } from "./chapter-listener.js";

const chapterTemplateBlock = `
    <div id='chapter-__chapter_number__' class='chapter' data-chapterNumber="__chapter_number__">
        <div class="chapter-header">
            <div class="chapter-title">__chapter_title__</div>
            <div class="chapter-domain">
                <a href="__chapter_link__" title="Chapter's source">
                __chapter_domain__
                </a>
            </div>
        </div>
        <div class="reader-chapter-content">__chapter_content__</div>
    </div>
`;

const chapterAdded = {};

export function addChapterToPage(chapter, chapterNumber, chapterTitle) {
    if (!chapter.title || chapterAdded[chapterNumber]) {
        return
    }
    chapterAdded[chapterNumber] = true;
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    const hostname = new URL(chapter.url).hostname;
    dummyDiv.innerHTML = chapterTemplateBlock
        .replace(/__chapter_number__/g, chapterNumber)
        .replace(/__chapter_link__/g, chapter.url)
        .replace(/__chapter_title__/g, chapterTitle || chapter.title)
        .replace(/__chapter_domain__/g, hostname)
        .replace(/__chapter_content__/g, filterContent(chapter));
    page.appendChild(dummyDiv.firstElementChild);
    console.log("added chapter to page", chapterNumber);
    attachObserversFor(document.getElementById("chapter-" + chapterNumber))
}

export function removeChapter(chapterNumber) {
    if (chapterAdded[chapterNumber]) {
        const chapterElement = document.getElementById(`chapter-${chapterNumber}`);
        removeChild(chapterElement);
        console.log("removed chapter from page", chapterNumber);
    }
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

const finBlock = `
<div id="fin-block">
    <h3>That's it folks!</h3>
    <br>
    (You have caught up with the latest chapter!)
</div>`;

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