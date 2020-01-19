import { removeChild, traverseAllElements } from "../util/dom-util.js";
import { getSanitizedChapterName, similarity } from "../util/string-util.js";

const chapterTemplateBlock = `
    <div id='chapter-__chapter_number__' class='chapter' data-chapterNumber="__chapter_number__" data-chapterTitle="__chapter_title__">
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
    const chapterName = (chapterNumber + 1) + ". " + getSanitizedChapterName(chapterTitle, hostname);
    dummyDiv.innerHTML = chapterTemplateBlock
        .replace(/__chapter_number__/g, chapterNumber)
        .replace(/__chapter_link__/g, chapter.url)
        .replace(/__chapter_title__/g, chapterName)
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
    const content = document.createElement('div');
    content.innerHTML = chapter.content;

    const hostname = new URL(chapter.url).hostname;
    Array.from(content.getElementsByTagName('a'))
        .forEach((anchorTag) => {
            // if (isSourceWebsiteUrl(anchorTag, hostname) ||
            if (isIncorrectRelativeUrlFromSource(anchorTag)) {
                removeChild(anchorTag);
            }
        });

    traverseAllElements(content, (element) => {
        let exit = false;
        const elementText = element.textContent;
        if (elementText.length < (chapterTitle.length * 3)) {
            const textSimilarity = similarity(elementText, chapterTitle);
            if (textSimilarity > 60) {
                exit = true;
                removeChild(element);
            }
        }
        return exit;
    });

    let newContent = null;
    // removing unnecessary nested elements
    traverseAllElements(content, (element) => {
        let exit = true;
        if (element.children.length === 1) {
            newContent = element;
            newContent.removeAttribute("id");
            if (newContent.firstElementChild) {
                newContent.firstElementChild.removeAttribute("id");
            }
            exit = false;
        }
        return exit
    });

    // removing elements which have read from source url
    traverseAllElements(newContent, (element) => {
        if (element.children.length === 0 && element.textContent.includes(hostname)) {
            removeChild(element);
        }
    });

    return newContent.innerHTML;
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
    let finElement = document.getElementById("fin-block");
    if (finElement) {
        return;
    }
    addFinToPage.done = true;
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = finBlock;
    finElement = dummyDiv.firstElementChild;
    page.appendChild(finElement);
}

export function removeFin() {
    const element = document.getElementById("fin-block");
    removeChild(element);
}
