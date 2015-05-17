var view$924 = require('../server/view');
var hasPrivil$925 = function (req$927) {
    return req$927.session.user.id === req$927.user.id || req$927.session.user.type === 2;
};
exports.run = function (req$928) {
    var output$929 = [];
    var path$930 = '/blog/' + req$928.user.id;
    var t$931 = output$929;
    output$929 = [];
    output$929.push('<', 'div', ' id="articlelist"', ' class="panel"', '>');
    output$929.push('<', 'div', ' class="panel_title"', '>');
    output$929.push('\u5168\u90E8\u535A\u6587');
    output$929.push('</', 'div', '>');
    output$929.push('<', 'div', ' class="panel_content"', '>');
    output$929.push('<', 'ul', ' id="article_list_compact"', '>');
    var blogs$932 = req$928.blogs, i$933, l$934 = blogs$932.length;
    for (i$933 = 0; i$933 < l$934; i$933++) {
        output$929.push('<', 'li', '>');
        output$929.push('<', 'a', ' href="', path$930 + '/entry/' + blogs$932[i$933].id, '"', '>');
        output$929.push(blogs$932[i$933].title);
        output$929.push('</', 'a', '>');
        output$929.push('<', 'span', ' class="align_right"', '>');
        output$929.push('<', 'span', ' class="blog_timestamp"', '>');
        output$929.push(blogs$932[i$933].created_time.toLocaleString());
        output$929.push('</', 'span', '>');
        if (hasPrivil$925(req$928)) {
            output$929.push('<', 'span', ' class="blog_operations"', '>');
            output$929.push('<', 'a', ' class="edit_blog"', ' href="', path$930 + '/edit/' + blogs$932[i$933].id, '"', '>');
            output$929.push('\u7F16\u8F91');
            output$929.push('</', 'a', '>');
            output$929.push('<', 'a', ' class="delete_blog"', ' href="', path$930 + '/delete/' + blogs$932[i$933].id + '?goto=' + path$930 + '/blog_list', '"', '>');
            output$929.push('\u5220\u9664');
            output$929.push('</', 'a', '>');
            output$929.push('</', 'span', '>');
        }
        output$929.push('</', 'span', '>');
        output$929.push('</', 'li', '>');
    }
    output$929.push('</', 'ul', '>');
    output$929.push('</', 'div', '>');
    output$929.push('</', 'div', '>');
    var bodyRight$935 = output$929.join('');
    output$929 = t$931;
    return view$924.render('layout', req$928, {
        nav: 1,
        bodyLeft: view$924.render('categories', req$928),
        bodyRight: bodyRight$935
    });
    return output$929.join('');
};