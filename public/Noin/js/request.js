var yql = 'https://query.yahooapis.com/v1/public/yql',
    query = "select link, title from rss where url in ";

var archiveRSS = 'https://www.instapaper.com/archive/rss/6046938/NICTyc9wt7REpAfLdbuUy6oMaMQ',
    instaRSS = 'https://www.instapaper.com/rss/6046938/N9fFsNCQydCE3Una3fFN90Y72M',
    nuRSS = 'https://www.novelupdates.com/rss.php?uid=43295&unq=57e3d82deb7ff&type=0&lid=local';

var sort = ' | sort(field="pubDate", descending="true")';

function reqInstapaperHome() {
    var timestamp = '?_= ' + Date.now();
    var url = instaRSS + timestamp;
    $.ajax({
        url: yql,
        dataType: "script",
        data: {
            q: query + encodeURI("('" + url + "')") + sort,
            format: 'json',
            callback: 'instapaperHome'
        }
    });
}

function reqInstapaperRss() {
    var timestamp = '?_= ' + Date.now();
    var archive = archiveRSS + timestamp,
        home = instaRSS + timestamp;
    $.ajax({
        url: yql,
        dataType: "script",
        data: {
            q: query + encodeURI("('" + archive + "','" + home + "')") + sort,
            format: 'json',
            callback: 'instapaperRSS'
        }
    });
}

function reqNuRss() {
    nuRSS += '&_= ' + Date.now();
    $.ajax({
        url: yql,
        dataType: "script",
        data: {
            q: query + encodeURI("('" + nuRSS + "')") + sort,
            format: 'json',
            callback: 'novelUpdate'
        }
    });
}
