import $ from 'jquery';
import { authEndpoint, addEndpoint } from './constants';

let config;

function generateArticles(title, url, start, end) {
    const articles = [];
    for (let i = start; i <= end; i += 1) {
        articles.push({
            title: `${title} ${i}`,
            url: url + i,
        });
    }
    return articles;
}


function loadUrl(articles, response) {
    if (articles.length === 0 ||
        !response || !(response.status === 200 || response.status === 201)) {
        return;
    }
    const article = articles.pop();
    config.url = addEndpoint;
    config.data.title = article.title;
    config.data.url = article.url;
    $.ajax(config);
}

function addArticles(values, username, password) {
    const articles = generateArticles(...Object.values(values));
    articles.reverse(); // so that we can pop() in chronological order
    window.loadUrl = loadUrl.bind(null, articles);

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
