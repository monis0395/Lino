export function getChapterLink(bookTitle, chapterNumber) {
    const baseURL = "./chapter.html?";
    const queryString = new URLSearchParams();
    queryString.append("book", bookTitle);
    queryString.append("chapter", chapterNumber);
    return baseURL + queryString.toString();
}
