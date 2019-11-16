import { removeChild, traverseAllElements } from "../util/dom-util.js";
import { similarity } from "../util/string-util.js";

const chapterTemplateBlock = `
    <div id='chapter-__chapter_number__' class='chapter' data-chapterNumber="__chapter_number__">
        <div class="chapter-header">
            <h2 class="chapter-title">__chapter_title__</h2>
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

    // use page instead of a container for chapters as it affects scroll when loading new chapters
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    const hostname = new URL(chapter.url).hostname;
    chapterTitle = chapterTitle || chapter.title;
    dummyDiv.innerHTML = chapterTemplateBlock
        .replace(/__chapter_number__/g, chapterNumber)
        .replace(/__chapter_link__/g, chapter.url)
        .replace(/__chapter_title__/g, chapterTitle)
        .replace(/__chapter_domain__/g, hostname)
        .replace(/__chapter_content__/g, filterContent(chapter, chapterTitle));
    const chapterElement = dummyDiv.firstElementChild;

    chapterAdded[chapterNumber] = chapterElement;
    const nextChapter = chapterAdded[chapterNumber + 1];
    if (nextChapter) {
        page.insertBefore(chapterElement, nextChapter);
    } else {
        page.appendChild(chapterElement);
    }
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

function filterContent(chapter, chapterTitle) {
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
    traverseAllElements(content, (element) => {
        const elementText = element.innerText;
        const textSimilarity = similarity(elementText, chapterTitle);
        if (textSimilarity > 60) {
            removeChild(element);
        }
    });
    return content.innerHTML;
}

function isSourceWebsiteUrl(anchorTag, hostname) {
    return anchorTag.hostname === hostname;
}

function isIncorrectRelativeUrlFromSource(anchorTag) {
    const reference = document.getElementById(anchorTag.hash);
    return !reference;
}

const finBlock = `
<div id="fin-block">
    <h6>That's it folks!</h6>
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