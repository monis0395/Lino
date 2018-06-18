import $ from 'jquery';

let config = {
    dataType: 'script',
    data: {
        jsonp: 'window.lino.loadUrl',
    },
};

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
    if (response && (response.status !== 200 || response.status !== 201)) {
        return;
    }
    // const addArticleUrl = 'https://www.instapaper.com/api/add';
    const article = articles.pop();
    // config.url = addArticleUrl;
    config.data.title = article.title;
    config.data.url = article.url;
    $.ajax(config);
}

function addArticles(values, username, password) {
    const articles = generateArticles(...Object.values(values));
    articles.reverse();
    window.lino = window.lino || {};
    const article = articles.pop();
    window.lino.loadUrl = loadUrl.bind(null, articles);
    // const authUrl = 'https://www.instapaper.com/api/authenticate';
    const addArticleUrl = 'https://www.instapaper.com/api/add';

    config = {
        url: addArticleUrl,
        data: {
            username,
            password,
            title: article.title,
            url: article.url,
            jsonp: 'window.lino.loadUrl',
        },
        dataType: 'script',
    };
    $.ajax(config);
}

export default addArticles;
