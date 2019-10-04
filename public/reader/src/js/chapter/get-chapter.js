import { fetchChapter } from "./chapter-store.js";
import { requestFor } from "../components/request-for.js";
import { storeChapter } from "./chapter-store.js";

const apiGetChapter = "https://monis0395.api.stdlib.com/getBook@dev/getChapter?url=";

export async function getChapter(chapterUrl) {
    const chapter = await fetchChapter(chapterUrl);
    if (chapter) {
        return chapter;
    }
    const response = await requestFor(apiGetChapter, chapterUrl);
    const _ = storeChapter(chapterUrl, response);
    return {
        ...response,
        url: chapterUrl,
    }
}
