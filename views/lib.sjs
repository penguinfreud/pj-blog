var escapeHTML = require("escape-html");

exports.jquery = function (req) {
    return exports.scriptOnce(req, '/scripts/jquery-2.1.4.min.js');
};

var hasOwnProperty = Object.prototype.hasOwnProperty;
exports.scriptOnce = function (req, src) {
    if (!req.scripts) {
        req.scripts = {};
    }
    if (!hasOwnProperty.call(req.scripts, src)) {
        req.scripts[src] = 1;
        return '<script src="' + src + '"></script>';
    } else {
        return '';
    }
};

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

exports.escapeHTML = escapeHTML;

exports.processContent = function (content) {
    return "<p>" + escapeHTML(content).replace(/\r\n|\r|\n/g, "</p><p>") + "</p>";
};

var hasPrivil = exports.hasPrivil = function (req, blog) {
    return req.session.user? req.session.user.id === blog.uid? 1:
        req.session.user.type === 2? 2: 0: 0;
};

exports.hasCommentPrivil = function (req, blog, comment) {
    if (!req.session.user) {
        return false;
    }
    var uid = req.session.user.id;
    return uid === blog.uid || uid === comment.uid ||
        req.session.user.type === 2;
};

exports.blogOperations = View(req, blog, separator) {
    var privil = hasPrivil(req, blog);
    if (privil) {
        @separator;
        if (privil === 1) {
            a.f.edit_blog (href='/blog/' + blog.uid + "/edit/" + blog.id) {
                @'编辑';
            }
            @separator;
        }
        @exports.jquery(req);
        @exports.scriptOnce(req, '/scripts/delete.js');
        a.f.del (href='/blog/' + blog.uid + "/delete/" + blog.id + "?goto=" + req.url,
            'data-obj'='《' + blog.title + '》') {
            @'删除';
        }
    }
};

exports.toolbar = View(req) {
    div#toolbar {
        span {
            if (req.session.user) {
                @'您好，';
                @req.session.user.nickname;
                @' ';
                a.f (href='/') {
                    @'首页';
                }
                @' ';
                a.f (href='/blog/' + req.session.user.id) {
                    @'我的博客';
                }
                @' ';
                a.f (href='/account') {
                    @'我的账号';
                }
                @' ';
                a.f (href='/logout?goto=' + req.url) {
                    @'退出';
                }
            } else {
                a.f (href='/') {
                    @'首页';
                }
                @' ';
                a.f (href='/login?goto=' + req.url) {
                    @'登录';
                }
            }
        }
    }
};

exports.pagination = View(paging) {
    var s = paging.start, ipp = paging.itemsPerPage, total = paging.total,
    hasPrev = s > 0,
    hasNext = paging.length === ipp;
    if (hasPrev || hasNext) {
        div {
            if (hasPrev) {
                a.f (href='?p=' + Math.max(s - ipp, 0)) {
                    @'&lt;前页';
                }
            } else {
                span.disabled {
                    @'&lt;前页';
                }
            }
            var t = Math.floor(s/ipp),
            l = Math.max((t - 5) * ipp, 0),
            last = Math.floor(total / ipp),
            u = Math.min((t + 6) * ipp, last);
            for (; l<=u; l++) {
                @' ';
                if (l * ipp === s) {
                    @(l + 1);
                } else {
                    a.f (href='?p=' + l * ipp) {
                        @(l + 1);
                    }
                }
            }
            @' ';
            if (hasNext) {
                a.f (href='?p=' + (s + ipp)) {
                    @'后页&gt;';
                }
            } else {
                span.disabled {
                    @'后页&gt;';
                }
            }
        }
    }
};
