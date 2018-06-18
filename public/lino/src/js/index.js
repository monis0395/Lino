import * as M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import createBooks from './ebook';
import addArticles from './instapaper';
import { email } from './constants';
import '../css/style.css';

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
    const username = 'smarty0395@gmail.com';
    const password = 'pass123';
    const values = getValues();
    addArticles(values, username, password);
}

function sendToKindle() {
    const type = 'mobi';
    const mode = 'email';
    const args = [email, type];
    const values = getValues();
    createBooks(values, mode, args);
}

function downloadEpub() {
    const type = 'epub';
    const mode = 'download';
    const args = [type];
    const values = getValues();
    createBooks(values, mode, args);
}

document.getElementById('send-to-instapaper').onclick = sendToInstapaper;
document.getElementById('send-to-kindle').onclick = sendToKindle;
document.getElementById('download-epub').onclick = downloadEpub;
