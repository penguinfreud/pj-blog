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

var pad = function (d) {
    return d< 10? "0" + d: "" + d;
};

exports.formatTime = function (date) {
    return [date.getFullYear(), "年",
        date.getMonth() + 1, "月",
        date.getDate(), "日 ",
        pad(date.getHours()), ":",
        pad(date.getMinutes()), ":",
        pad(date.getSeconds())].join("");
};

exports.processContent = function (content) {
    return "<p>" + escapeHTML(content).replace(/\r\n|\r|\n/g, "</p><p>") + "</p>";
};

exports.unprocessContent = function (content) {
    content = String(content);
    return content.substring(3, content.length - 4)
        .replace(/<\/p><p>/g, "\n");
};

var hasPrivil = exports.hasPrivil = function (req, blog) {
    return req.session.user? req.session.user.id === blog.uid? 1:
        req.session.user.type === 2? 2: 0: 0;
};

exports.blogOperations = View(req, blog, separator) {
    var privil = hasPrivil(req, blog);
    if (privil) {
        @separator;
        if (privil === 1) {
            a.edit_blog (href='/blog/' + blog.uid + "/edit/" + blog.id) {
                @'编辑';
            }
            @separator;
        }
        a.delete_blog (href='/blog/' + blog.uid + "/delete/" + blog.id) {
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

exports.pagination = View(req) {
    div {
        if (req.start > 0) {
            a (href='?p=' + Math.max(req.start - req.itemsPerPage, 0)) {
                @'&lt;前页';
            }
        } else {
            span.disabled {
                @'&lt;前页';
            }
        }
        @' ';
        if (req.blogs.length === req.itemsPerPage) {
            a (href='?p=' + (req.start + req.itemsPerPage)) {
                @'后页&gt;';
            }
        } else {
            span.disabled {
                @'后页&gt;';
            }
        }
    }
};
