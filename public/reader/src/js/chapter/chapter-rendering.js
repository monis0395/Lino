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
        .replace('$chapter_content$', chapter.content);
    page.appendChild(dummyDiv);
}