/*var articles = [
    {
        "title": "The Book Eating Magician c226",
        "link": "http://novelplanet.com/Novel/The-Book-Eating-Magician/c226"
    },
    {
        "title": "The Book Eating Magician c227",
        "link": "http://novelplanet.com/Novel/The-Book-Eating-Magician/c227"
    },
    {
        "title": "In a Different World with a Smartphone c220",
        "link": "http://novelplanet.com/Novel/In-a-Different-World-with-a-Smartphone/c220"
    }];*/

function renderHomeArticles(articles) {
    articles.forEach(function (obj) {
        console.log(`<a target="_blank" href='${obj.link}'>${obj.title}</a>`);
    })
}
/*
var obj = {
    "title": "The Book Eating Magician c226",
    "link": "http://novelplanet.com/Novel/The-Book-Eating-Magician/c226"
};*/

function renderArticle(message, obj) {
    console.log(`${message} <a target="_blank" href='${obj.link}'>${obj.title}</a>`);

}