import $ from 'jquery';
import { generateUrls } from './util';
import { authEndpoint, addEndpoint } from './constants';

let config;

function loadUrl(urls, response) {
    if (urls.length === 0 ||
        !response || !(response.status === 200 || response.status === 201)) {
        return;
    }
    config.url = addEndpoint;
    config.data.url = urls.pop();
    $.ajax(config);
}

function addArticles(values, username, password) {
    const urls = generateUrls(values.url, values.start, values.end);
    urls.reverse(); // so that we can pop() in chronological order
    window.loadUrl = loadUrl.bind(null, urls);

    config = {
        url: authEndpoint,
        data: {
            username,
            password,
            jsonp: 'loadUrl',
        },
        dataType: 'script',
    };
    $.ajax(config);
}

export default addArticles;
