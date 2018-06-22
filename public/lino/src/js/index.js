import * as M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import '../css/style.css';
import { createEBooks, publishBooks } from './ebook';
import addArticles from './instapaper';
import { email, username, password } from './constants';

document.addEventListener('DOMContentLoaded', () => {
    M.AutoInit(document.body);
});

function getValues() {
    const title = document.getElementById('title').value || 'Untitled';
    const url = document.getElementById('url').value;
    let start = document.getElementById('start-index').value;
    let end = document.getElementById('end-index').value;
    start = parseInt(start, 10);
    end = parseInt(end, 10);
    return {
        title,
        url,
        start,
        end,
    };
}

function sendToInstapaper() {
    const values = getValues();
    addArticles(values, username, password);
}

function sendToKindle() {
    const type = 'mobi';
    const values = getValues();
    const books = createEBooks(values, type, email);
    publishBooks(books);
}

function downloadEpub() {
    const type = 'epub';
    const values = getValues();
    const books = createEBooks(values, type);
    publishBooks(books);
}

document.getElementById('send-to-instapaper').onclick = sendToInstapaper;
document.getElementById('send-to-kindle').onclick = sendToKindle;
document.getElementById('download-epub').onclick = downloadEpub;
