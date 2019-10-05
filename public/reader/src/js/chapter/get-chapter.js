import { fetchChapter, storeChapter } from "./chapter-store.js";
import { requestFor } from "../components/request-for.js";

const apiGetChapter = "https://monis0395.api.stdlib.com/getBook@dev/getChapter?url=";

export async function getChapter(chapterUrl) {
    let chapter = await fetchChapter(chapterUrl);
    if (chapter) {
        return chapter;
    }
    const response = await requestFor(apiGetChapter, chapterUrl);
    chapter = await storeChapter(chapterUrl, response);
    return chapter;
}
