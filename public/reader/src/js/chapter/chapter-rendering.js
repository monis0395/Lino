import { removeChild } from "../util/dom-util.js";

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

    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    const hostname = new URL(chapter.url).hostname;
    dummyDiv.innerHTML = chapterTemplateBlock
        .replace(/__chapter_number__/g, chapterNumber)
        .replace(/__chapter_link__/g, chapter.url)
        .replace(/__chapter_title__/g, chapterTitle || chapter.title)
        .replace(/__chapter_domain__/g, hostname)
        .replace(/__chapter_content__/g, filterContent(chapter));
    const chapterElement = dummyDiv.firstElementChild;

    chapterAdded[chapterNumber] = chapterElement;
    page.appendChild(chapterElement);
    console.log("added chapter to page", chapterNumber);
}

export function getChapterElement(chapterNumber) {
    return chapterAdded[chapterNumber];
}

export function getAllChaptersRendered() {
    return chapterAdded;
}

export function removeChapter(chapterNumber) {
    const chapterElement = getChapterElement(chapterNumber);
    if (chapterElement) {
        removeChild(chapterElement);
        delete chapterAdded[chapterNumber];
        console.log("removed chapter from page", chapterNumber);
    }
}

export function removeChaptersExcept(chapterNumber, exceptionList) {
    Object.keys(chapterAdded).forEach((addedChapterNumber) => {
        addedChapterNumber = parseInt(addedChapterNumber, 10);
        if (!exceptionList.includes(addedChapterNumber)) {
            removeChapter(addedChapterNumber);
        }
    })
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
    page.appendChild(dummyDiv.firstElementChild);
}

export function removeFin() {
    if (addFinToPage.done) {
        const element = document.getElementById("fin-block");
        removeChild(element);
        addFinToPage.done = false;
    }
}