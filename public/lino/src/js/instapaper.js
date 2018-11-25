import $ from 'jquery';
import { generateUrls } from './util';
import { authEndpoint, addEndpoint } from './constants';
import {addMessageBox, updateProgress} from "./message-box";

let config;

function addUrls(messageBoxId, urls, response) {
    if (urls.length === 0 ||
        !response || !(response.status === 200 || response.status === 201)) {
        updateProgress(messageBoxId, 'Done!');
        return;
    }
    const currentURL = urls.pop();
    updateProgress(messageBoxId, 'Adding ' + currentURL);

    config.url = addEndpoint;
    config.data.url = currentURL;
    $.ajax(config);
}

function authAndAddUrls(values, username, password) {
    const urls = generateUrls(values.url, values.start, values.end);
    urls.reverse(); // so that we can pop() in chronological order
    const messageTitle =  `${values.title} ${values.start}-${values.end}`;
    const messageBoxId = addMessageBox(messageTitle, true);
    updateProgress(messageBoxId, 'Authenticating');

    window.addUrls = addUrls.bind(null, messageBoxId, urls);

    config = {
        url: authEndpoint,
        data: {
            username,
            password,
            jsonp: 'addUrls',
        },
        dataType: 'script',
    };
    $.ajax(config);
}

//todo: need to refactor the code separate update progress and adding urls

export default authAndAddUrls;
