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
            res.status(404).send("Not Found");
        } else {
            req.user = rows[0];
            next();
        }
    });
};

exports.getBlogCategories = function (req, res, next) {
    var blogs = req.blogs, i, l = blogs.length, categories = [], category;
    if (l > 0) {
        for (i = 0; i<l; i++) {
            category = blogs[i].category;
            if (categories.indexOf(category) === -1) {
                categories.push(category);
            }
        }
        conn.query("select id, name from categories where id in (?" +
            new Array(categories.length).join(", ?") + ")",
            categories, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    req.categories = rows;
                    next();
                }
            });
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

exports.addTags = function (req, res, next) {
    var tags = escapeHTML(req.body.tags).split(/\s+/g),
        id = req.blogId,
        i, l = tags.length, count = 0;
    if (l === 0) {
        next();
    } else {
        for (i = 0; i<l; i++) {
            conn.execute("insert into tags (blog_id, name) values (?, ?)", 
                [id, tags[i]], function (err, result) {
                    if (err) {
                        next(err);
                    } else if (++count === l) {
                        next();
                    }
                });
        }
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
