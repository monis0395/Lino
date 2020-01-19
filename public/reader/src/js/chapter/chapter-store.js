const chapterDB = localforage.createInstance({name: "chapter"});

export async function fetchChapter(url) {
    return chapterDB.getItem(url);
}

export async function removeChapter(url) {
    return chapterDB.removeItem(url)
}

export async function storeChapter(url, chapter) {
    if (!chapter.url) {
        chapter.url = url
    }
    const oldChapter = await chapterDB.getItem(url) || {};
    return chapterDB.setItem(url, {
        ...oldChapter,
        ...chapter,
    })
}
