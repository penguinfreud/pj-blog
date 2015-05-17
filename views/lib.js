exports.script = function (src) {
    return '<script src="' + src + '"></script>';
};

exports.style = function (href) {
    return '<link rel="stylesheet" href="' + href + '" />';
};

exports.title = function (title) {
    return '<title>' + title + '</title>';
};

exports.getCategoryName = function (categories, id) {
    var i = categories.length;
    while (i--) {
        if (categories[i].id === id) {
            return categories[i].name;
        }
    }
    return "";
};

exports.formatTime = function (date) {
    return [date.getFullYear(), "年",
        date.getMonth() + 1, "月",
        date.getDate(), "日 ",
        date.getHours(), ":",
        date.getMinutes(), ":",
        date.getSeconds()].join("");
};

exports.unescapeHTML = function (str) {
    return str.replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
};

exports.unprocessContent = function (content) {
    return exports.unescapeHTML(
        content.substring(3, content.length - 4)
            .replace(/<\/p><p>/g, "\n"));
};
