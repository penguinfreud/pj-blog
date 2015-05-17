var view$898 = require('../server/view');
exports.run = function (req$900) {
    var output$901 = [];
    output$901.push('<', 'div', ' id="articlelist"', ' class="panel"', '>');
    output$901.push('<', 'div', ' class="panel_title"', '>');
    output$901.push('\u535A\u6587');
    output$901.push('</', 'div', '>');
    output$901.push('<', 'div', ' class="panel_content"', '>');
    var b$902 = req$900.blogs, i$903, l$904 = b$902.length;
    for (i$903 = 0; i$903 < l$904; i$903++) {
        output$901.push(view$898.render('blogSummary', req$900, b$902[i$903]));
    }
    output$901.push('</', 'div', '>');
    output$901.push('</', 'div', '>');
    return output$901.join('');
};