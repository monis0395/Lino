const functions = require('firebase-functions');
const express = require("express");
const app = express();
const read = require('node-readability');

// exports.helloWorld = functions.https.onRequest(function(request, response) {
//     return response.send("Hello from Firebase!");
// });

app.get("*", function (request, response) {
    response.send("Hello from Express on Firebase!");
});

app.post("/api/getcontent", function (request, response) {
    /** @namespace request.body.rawHtml */
    let rawHtml = request.body && request.body.rawHtml;
    let url = request.body && request.body.url;

    read(rawHtml, function (err, article) {
        let object = {
            content: article.content,
            title: article.title
        };

        response.send(JSON.stringify(object));
        console.log("URL:", url, " Title:", article.title, ", response sent!!");
    });
});

app.post("/api/hello", function (request, response) {
    let name = request.body.name;
    response.send("Hello from Express on Firebase!" + name);
});


const exposedFunctions = functions.https.onRequest(app);
module.exports = {
    exposedFunctions
};