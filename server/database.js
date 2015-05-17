var mysql = require("mysql2");

var conn = exports.connection = mysql.createConnection({
    user: "wsy",
    password: "RozOmDiorv6",
    database: "weblab"
});

process.on("exit", function () {
    conn.close();
});

var $cb = function (req, key, next) {
    return function (err, rows) {
        if (err) {
            next(err);
        } else {
            req[key] = rows;
            next();
        }
    };
}

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

exports.getBlogs = function (hasContent, count) {
    return function (req, res, next) {
        var start = parseInt(req.query.start);
        if (!isFinite(start) || start < 0) {
            start = 0;
        }
        
        conn.query("select title" +
            (hasContent? ", substr(content, 0, 250)": "") +
            ", created_time, category, read_count, like_count, comment_count from blogs where uid=? limit ? offset ?",
        [req.params.uid, count, start], function (err, rows) {
            if (err) {
                next(err);
            } else {
                req.blogs = rows;
                if (rows.length === 0) {
                    next();
                } else {
                    rows.forEach(getBlogTags({
                        total: rows.length,
                        count: 0,
                        next: next
                    }));
                }
            }
        });
    };
};

var getBlogTags = function (context) {
    return function (blog) {
        conn.query("select tags.id, tags.name from blog_tags, tags where blog_tags.tag_id=tags.id and blog_tags.blog_id=?",
        [blog.id], function (err, rows) {
            if (err) {
                context.next(err);
            } else {
                blog.tags = rows;
                if (++context.count === context.total) {
                    context.next();
                }
            }
        });
    };
};

exports.getCategories = function (req, res, next) {
    conn.query("select * from categories where uid=?",
    [req.params.uid], $cb(req, "categories", next));
};
