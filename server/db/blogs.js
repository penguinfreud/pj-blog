var db = require("../database"),
escapeHTML = require("escape-html");
var conn = db.connection;

db.getBlogs = function (options) {
    return function (req, res, next) {
        var start = parseInt(req.query.p);
        if (!isFinite(start) || start < 0) {
            start = 0;
        }
        req.start = start;
        
        var where = [], params = [];
        if (!options.allUser) {
            where.push("uid=?");
            params.push(req.params.uid);
        }
        if (options.category) {
            where.push("category=?");
            params.push(req.params.category_id);
        }
        if (options.tag) {
            where.push("(?, id) in (select name, blog_id from tags)");
            params.push(req.params.tag);
        }
        if (where.length > 0) {
            where = " where " + where.join(" and ");
        }
        params.push(options.itemsPerPage, start);
        req.itemsPerPage = options.itemsPerPage;
        
        conn.query("select id, uid, title" +
            (options.hasContent? ", substr(content, 1, 250) as content": "") +
            ", created_time, category, read_count, like_count, comment_count from blogs" + where +
            " order by created_time desc limit ? offset ?", params,
        function (err, rows) {
            if (err) {
                next(err);
            } else {
                req.blogs = rows;
                if (rows.length === 0) {
                    next();
                } else {
                    var context = {
                        total: rows.length,
                        count: 0,
                        next: next
                    };
                    rows.forEach(getBlogTags(context));
                    rows.forEach(likeOrNot(req, context));
                }
            }
        });
    };
};

var getBlogTags = function (context) {
    return function (blog) {
        conn.query("select tags.id, tags.name from tags where tags.blog_id=?",
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

var likeOrNot = function (req, context) {
    if (req.session.user) {
        context.total += context.total;
        return function (blog) {
            conn.query("select count(*) as c from likes where uid=? and blog_id=?",
                [req.session.user.id, blog.id], function (err, rows) {
                    if (err) {
                        context.next(err);
                    } else {
                        blog.liked = rows[0].c === 1;
                        if (++context.count === context.total) {
                            context.next();
                        }
                    }
                });
        };
    }
};

db.getAuthors = function (req, res, next) {
    var blogs = req.blogs, i, l = blogs.length, uids = [], uid;
    if (l > 0) {
        for (i = 0; i<l; i++) {
            uid = blogs[i].uid
            if (uids.indexOf(uid) === -1) {
                uids.push(uid);
            }
        }
        conn.query("select id, nickname from users where id in (?" +
            new Array(uids.length).join(", ?") + ")",
            uids, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    req.users = rows;
                    next();
                }
            });
    }
};

db.getSingleBlog = function (req, res, next) {
    conn.query("select * from blogs where id=?",
    [req.params.blog_id], function (err, rows) {
        if (err) {
            next(err);
        } else if (rows.length === 0) {
            res.status(404).send("Not Found");
        } else {
            req.blog = rows[0];
            var context = {
                total: 1,
                count: 0,
                next: next
            };
            getBlogTags(context)(rows[0]);
            likeOrNot(req, context)(rows[0]);
        }
    });
};

db.getPrevBlog = function (req, res, next) {
    conn.query("select id, title from blogs where created_time<? and uid=? order by created_time desc limit 1",
        [req.blog.created_time, req.params.uid], function (err, rows) {
            if (err) {
                next(err);
            } else {
                if (rows.length === 1) {
                    req.prevBlog = rows[0];
                }
                next();
            }
        });
};

db.getNextBlog = function (req, res, next) {
    conn.query("select id, title from blogs where created_time>? and uid=? order by created_time asc limit 1",
        [req.blog.created_time, req.params.uid], function (err, rows) {
            if (err) {
                next(err);
            } else {
                if (rows.length === 1) {
                    req.nextBlog = rows[0];
                }
                next();
            }
        });
};

db.postBlog = function (req, res, next) {
    var uid = req.session.user.id;
    req.uid = uid;
    
    conn.execute("insert into blogs (uid, title, content, category, created_time, last_modified) values (?, ?, ?, ?, now(), now())",
            [uid,
            escapeHTML(req.body.title),
            req.body.content,
            req.body.category],
        function (err, result) {
            if (err) {
                next(err);
            } else {
                req.blogId = result.insertId;
                next();
            }
        });
};

db.editBlog = [
    db.incCategory,
    db.removeTags,
    function (req, res, next) {
        req.uid = req.session.user.id;
        req.blogId = req.params.blog_id;
        conn.execute("update blogs set title=?, content=?, category=?, last_modified=now() where id=?",
                [escapeHTML(req.body.title),
                req.body.content,
                req.body.category,
                req.blogId],
            function (err, result) {
                if (err) {
                    next(err);
                } else {
                    next();
                }
            });
    }
];

db.deleteBlog = [
    db.decCategory,
    db.removeTags,
    function (req, res, next) {
        conn.execute("delete from blogs where id=?",
            [req.params.blog_id], function (err, result) {
                if (err) {
                    next(err);
                } else {
                    next();
                }
            });
    }
];
