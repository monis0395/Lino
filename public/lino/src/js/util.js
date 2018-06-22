/* eslint-disable import/prefer-default-export */
function generateUrls(url, start, end) {
    const urls = [];
    for (let i = start; i <= end; i += 1) {
        urls.push(url + i);
    }
    return urls;
}


export { generateUrls };
