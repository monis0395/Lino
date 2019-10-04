import { hideElement, showElement } from "../util/dom-util.js";

const loaderTemplate = `<img src="../images/flip-book-loader.svg" class="center" id="loader" alt="">`;

function addLoaderToBody() {
    const div = document.createElement('div');
    div.innerHTML = loaderTemplate;
    document.body.appendChild(div);
}

export function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        showElement(loader);
    } else {
        addLoaderToBody();
    }
}

export function hideLoader() {
    const loader = document.getElementById("loader");
    hideElement(loader);
}