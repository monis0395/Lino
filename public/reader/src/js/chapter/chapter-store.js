const chapterDB = localforage.createInstance({name: "chapter"});

export async function fetchChapter(url) {
    return chapterDB.getItem(url);
}

export async function storeChapter(url, chapter) {
    if (!chapter.url) {
        chapter.url = url
    }
    return chapterDB.setItem(url, chapter)
}