const chapterDB = localforage.createInstance({name: "chapter"});

export async function fetchChapter(url) {
    return chapterDB.getItem(url);
}

export function storeChapter(url, chapter) {
    if (!chapter.url) {
        chapter.url = url
    }
    chapterDB.setItem(url, chapter)
}