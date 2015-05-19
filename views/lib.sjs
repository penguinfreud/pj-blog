var escapeHTML = require("escape-html");

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

exports.getNickname = function (users, id) {
    var i = users.length;
    while (i--) {
        if (users[i].id === id) {
            return users[i].nickname;
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

exports.processContent = function (content) {
    return "<p>" + escapeHTML(content).replace(/\r\n|\r|\n/g, "</p><p>") + "</p>";
};

exports.unprocessContent = function (content) {
    content = String(content);
    return content.substring(3, content.length - 4)
        .replace(/<\/p><p>/g, "\n");
};

var hasPrivil = exports.hasPrivil = function (req) {
    return req.session.user? req.user && req.session.user.id === req.user.id? 1:
        req.session.user.type === 2? 2: 0: 0;
};

exports.blogOperations = View(req, blog, separator) {
    if (hasPrivil(req)) {
        @separator;
        if (hasPrivil(req) === 1) {
            a.edit_blog (href='/edit/' + blog.id) {
                @'编辑';
            }
            @separator;
        }
        a.delete_blog (href='/delete/' + blog.id +
                '?goto=/blog/' + blog.uid + '/blog_list') {
            @'删除';
        }
    }
};

exports.toolbar = View(req) {
    div#toolbar {
        span {
            if (req.session.user) {
                @req.session.user.nickname;
                @' ';
                a (href='/blog/' + req.session.user.id) {
                    @'我的博客';
                }
                @' ';
                a (href='/account') {
                    @'我的账号';
                }
                @' ';
                a (href='/logout?goto=' + req.originalUrl) {
                    @'退出';
                }
            } else {
                a (href='/login') {
                    @'登录';
                }
            }
        }
    }
};
