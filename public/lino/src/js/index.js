import '../css/style.css';
import { createEBooks, publishBooks } from './ebook';
import addArticles from './instapaper';
import attachTemplatesToDom from './credentials-manager';
import { email, username, password } from './auth';

const callbacks = {
    sendToInstapaper,
    sendToKindle,
    downloadEpub,
};

let selected = "none";

function getValues() {
    const title = document.getElementById('title').value || 'Untitled';
    const url = document.getElementById('url').value;
    let start = document.getElementById('start-index').value;
    let end = document.getElementById('end-index').value;
    start = parseInt(start, 10);
    end = parseInt(end, 10);
    return {
        title, url, start, end,
    };
}

function getCredentials() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    return {
        username, password, email,
    }
}

function sendToInstapaper() {
    const values = getValues();
    const credentials = getCredentials();
    addArticles(values, credentials.username, credentials.password);
}

function sendToKindle() {
    const type = 'mobi';
    const values = getValues();
    const credentials = getCredentials();
    const books = createEBooks(values, type, credentials.email);
    publishBooks(books);
}

function downloadEpub() {
    const type = 'epub';
    const values = getValues();
    const books = createEBooks(values, type);
    publishBooks(books);
}

function onSubmit() {
    if (selected !== 'none') {
        callbacks[selected]()
    }
}

function clickedSendToInstapaper() {
    if (selected !== 'none') {
        return
    }
    selected = 'sendToInstapaper';
    attachTemplatesToDom(['username', 'password']);
    const submitButton = document.getElementById('submit');
    submitButton.classList.remove('hide');
}

function clickedSendToKindle() {
    if (selected !== 'none') {
        return
    }
    selected = 'sendToKindle';
    attachTemplatesToDom(['email']);
    const submitButton = document.getElementById('submit');
    submitButton.classList.remove('hide');
}

function clickedDownloadEpub() {
    if (selected !== 'none') {
        return
    }
    selected = 'downloadEpub';
    const submitButton = document.getElementById('submit');
    submitButton.classList.remove('hide');
}

function documentOnload() {
    M.AutoInit(document.body);

    document.getElementById('send-to-instapaper').onclick = clickedSendToInstapaper;
    document.getElementById('send-to-kindle').onclick = clickedSendToKindle;
    document.getElementById('download-epub').onclick = clickedDownloadEpub;
    document.getElementById('submit').onclick = onSubmit;
}

document.addEventListener('DOMContentLoaded', documentOnload);
