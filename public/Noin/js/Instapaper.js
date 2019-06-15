var current = 0,
    last = 0,
    urls = [];

function loadNext(obj) {
    last = current - 1;
    var loadedObj = urls[last];
    var message = 'loaded url #' + (last + 1);
    handleBookmark(message, loadedObj, obj.text);

    if ((obj.status === 201 || obj.status === 200) && current !== urls.length) {
        instapaperAdd(urls[current++]);
    } else {
        insertEquals();
        console.log('All URls loaded');
        insertFire();
    }
}

function handleBookmark(message, loadedObj, text) {
    var id = JSON.parse(text).bookmark_id;

    var bkObj = getBookmarks(loadedObj, id);
    var renObj = genRenderObject(bkObj);
    renderArticle(message, renObj);
}

function getBookmarks(obj, bookmark_id) {
    return {
        title: obj.title,
        link: obj.link,
        bookmark_id: bookmark_id
    };
}

function instapaperAdd(obj) {
    var username = 'smarty0395@gmail.com',
        password = 'pass123',
        instapaper = 'https://www.instapaper.com/api/add';

    var timeStamp = Date.now(),
        url = obj.link + "?_=" + timeStamp;

    $.ajax({
        url: instapaper,
        data: {
            username: username,
            password: password,
            title: obj.title,
            url: url,
            jsonp: 'loadNext'
        },
        dataType: "script"
    });
}

function initInstapaper(list) {
    urls = list;
    if (urls.length === 0) {
        return;
    }

    instapaperAdd(urls[current++]);
}
