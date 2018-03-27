function tranformTitle(str) {
    str = str.slice(0, str.lastIndexOf(' c')) + '/' + str.slice(str.lastIndexOf(' c') + 1, str.length);
    str = str.replace(/~/g, '').replace(/\s+/g, ' ');
    str = str.replace(/[^a-zA-Z0-9\/]/g, '-');
    return str;
}

function cleanLink(str) {
    return str.replace(/\?id=[0-9]*/, '');
}

function cleanTitle(str) {
    return str.replace(/\*/g, '');
}

function replaceChemistry(str) {
    return str.replace('Chemistry ', 'Chemi ');
}

function getURl(str) {
    var start = 'http://novelplanet.com/Novel/';
    str = cleanTitle(str);
    str = replaceChemistry(str);
    return start + tranformTitle(str);
}

function getBookmarkUrl(bookmark_id) {
    var read = 'https://www.instapaper.com/read/';
    return read + bookmark_id;
}

function genRenderObject(obj) {
    return {
        title: obj.title,
        link: getBookmarkUrl(obj.bookmark_id)
    };
}

function insertEquals() {
    console.log("====================================");
}

function insertFire() {
    console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
}

function overrideConsole() {
    var old = console.log;
    var logger = document.getElementById('message');
    console.log = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
            } else {
                logger.innerHTML += arguments[i] + '<br />';
            }
        }
        logger.innerHTML += '<br />';
        old.apply(this, arguments);
    }
}