import { isValidURL } from "../util/url-util.js";

export function requestBook(link) {
    const api = "https://monis0395.api.stdlib.com/getBook@dev?url=";
    return new Promise(function (resolve, reject) {
        if (!isValidURL(link)) {
            reject("invalid link");
            return
        }
        fetch(api + encodeURIComponent(link))
            .then(response => response.json().then(data => {
                if (response.ok) {
                    resolve(data)
                } else {
                    reject(data)
                }
            }))
            .catch(error => reject(error))
    });
}