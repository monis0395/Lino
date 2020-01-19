import { isValidURL } from "../util/url-util.js";

export function requestFor(apiLink, link) {
    return new Promise(function (resolve, reject) {
        if (!isValidURL(link)) {
            reject("invalid link");
            return
        }
        fetch(apiLink + encodeURIComponent(link))
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
