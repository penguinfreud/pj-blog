var mysql = require("mysql2"),
escapeHTML = require("escape-html");

var conn = exports.connection = mysql.createConnection({
    user: "wsy",
    password: "RozOmDiorv6",
    database: "weblab"
});

process.on("exit", function () {
    conn.close();
});

exports.getUser = function (req, res, next) {
    conn.query("select id, nickname, icon, description from users where id=?",
    [req.params.uid], function (err, rows) {
        if (err) {
            next(err);
        } else if (rows.length === 0) {
            app.get("notFound")(req, res, next);
        } else {
            req.user = rows[0];
            next();
        }
    });
};

exports.getSearchUser = function (req, res, next) {
    if (req.query.uid) {
        conn.query("select id, nickname from users where id=?",
        [req.query.uid], function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length === 0) {
                res.redirect("/search");
            } else {
                req.user = rows[0];
                next();
            }
        });
    } else {
        next();
    }
};

exports.increaseReadCount = function (req, res, next) {
    if (!req.session.user || req.session.user.id !== parseInt(req.params.uid)) {
        conn.execute("update blogs set read_count=read_count+1 where id=?",
            [req.params.blog_id], function (err, result) {
                if (err) {
                    next(err);
                } else {
                    next();
                }
            });
    } else {
        next();
    }
};

exports.checkAuthor = function (req, res, next) {
    conn.query("select uid, category from blogs where id=? and uid=?",
        [req.params.blog_id, req.params.uid], function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length === 1) {
                if (rows[0].uid === req.session.user.id ||
                    req.session.user.type === 2 && req.allowAdmin) {
                    req.oldCategory = rows[0].category;
                    next();
                } else {
                    next(new Error("You don't have privilege"));
                }
            } else {
                next(new Error("Blog does not exist"));
            }
        });
};

exports.checkPrivil = function (req, res, next) {
    req.allowAdmin = true;
    exports.checkAuthor(req, res, next);
};

var hasOwnProperty = Object.prototype.hasOwnProperty;
exports.addTags = function (req, res, next) {
    var tags = escapeHTML(req.body.tags).split(/\s+/g),
        table = {},
        id = req.blogId,
        tag, i, l = 0, count = 0;
    for (i = 0; i<tags.length; i++) {
        tag = tags[i];
        if (tag !== "" && !hasOwnProperty.call(table, tag)) {
            table[tag] = 1;
            l++;
            conn.execute("insert into tags (blog_id, name) values (?, ?)", 
                [id, tag], function (err, result) {
                    if (err) {
                        next(err);
                    } else if (++count === l) {
                        next();
                    }
                });
        }
    }
    if (l === 0) {
        next();
    }
};

exports.removeTags = function (req, res, next) {
    conn.execute("delete from tags where blog_id=?",
        [req.params.blog_id], function (err, result) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
};

require("./db/categories");
require("./db/comments");
require("./db/blogs");
require("./db/account");
require("./db/likes");
require("./db/search");
