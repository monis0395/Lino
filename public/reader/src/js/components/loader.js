import { hideElement, showElement } from "../util/dom-util.js";

const loaderTemplate = `
<div id="loader-container">
    <img src="../images/flip-book-loader.svg" id="loader" alt="">
</div>`;

function addLoaderToBody() {
    const div = document.createElement('div');
    div.innerHTML = loaderTemplate;
    document.body.appendChild(div.firstElementChild);
}

export function showLoader() {
    const loader = document.getElementById("loader-container");
    if (loader) {
        showElement(loader);
    } else {
        addLoaderToBody();
    }
}

export function hideLoader() {
    const loader = document.getElementById("loader-container");
    hideElement(loader);
}