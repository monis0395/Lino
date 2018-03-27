//----------------------NU RSS request and success---------
var filteredList = [];

function novelUpdate(x) {
    if (x.query.count === 0) {
        console.log('Novel Update RSS: No articles found.');
        return;
    }
    var listItems, link, title;
    listItems = x.query.results.item;
    console.log('Loaded Novel Update links');
    insertEquals();

    listItems.forEach(function (item) {
        title = cleanTitle(item.title);
        link = getURl(item.title);
        addInFilteredList(title, link);
    });

    if (filteredList.length === 0) {
        console.log('No new Articles!');
        insertFire();
        return;
    }

    filteredList.reverse();
    console.log('Filtered list generated!');
    renderHomeArticles(filteredList);
    insertEquals();
    initInstapaper(filteredList);
}

function addInFilteredList(title, link) {
    if (!whitelist[title] && !whitelist[link]) {
        filteredList.push({
            title: title,
            link: link
        });
    }
}

//----------------------Insta Home and Archive RSS request and success------------
var whitelist = {};

function instapaperRSS(x) {
    if (x.query.count === 0) {
        console.log('Instapaper Home and Archive: No articles saved.');
        reqNuRss();     //Request from Novel Updates
        return;
    }

    var listItems, link, title;
    listItems = x.query.results.item;
    console.log('Loaded Instapaper Home and Archive links');

    function pushInWhitelist(item) {
        link = cleanLink(item.link);
        title = item.title;
        whitelist[link] = true;
        whitelist[title] = true;
    }

    if (Array.isArray(listItems)) {
        listItems.forEach(pushInWhitelist);
    } else {
        pushInWhitelist(listItems);
    }
    insertEquals();

    reqNuRss();     //Request from Novel Updates
}

//----------------------Insta Home request and success------------
var instaTable = [];

function instapaperHome(x) {
    reqInstapaperRss();
    if (x.query.count === 0) {
        console.log('Instapaper Home: No articles saved.');
        return;
    }
    var listItems = x.query.results.item;
    console.log('Loaded Instapaper Home links');

    function pushInInstaTable(item) {
        instaTable.push(item);
    }

    if (Array.isArray(listItems)) {
        listItems.forEach(pushInInstaTable);
    } else {
        pushInInstaTable(listItems);
    }
    renderHomeArticles(instaTable);      // render home articles in HTML
    insertEquals();

}