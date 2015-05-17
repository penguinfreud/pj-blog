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
        
        conn.query("select id, title" +
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

exports.getCategories = function (uid, req, res, next) {
    conn.query("select * from categories where uid=?",
    [uid], $cb(req, "categories", next));
};

exports.createCategory = function (req, res, next) {
    var name = req.body.name;
    if (name) {
        conn.execute("insert into categories (uid, name) values (?, ?)",
        [req.session.user.id, name], function (err, result) {
            if (err) {
                console.log(e.stack);
                res.send();
            } else {
                res.send(result.insertId);
            }
        });
    } else {
        res.send();
    }
};

exports.getSingleBlog = function (req, res, next) {
    conn.query("select * from blogs where id=?",
    [req.params.blog_id], function (err, rows) {
        if (err) {
            next(err);
        } else if (rows.length === 0) {
            res.status(404).send("Not Found");
        } else {
            req.blog = rows[0];
            getBlogTags({
                total: 1,
                count: 0,
                next: next
            })(rows[0]);
        }
    });
};

exports.getSingleCategory = function (req, res, next) {
    conn.query("select categories.* from categories, blogs where categories.id=blogs.category and blogs.id=?",
    [req.params.blog_id], function (err, rows) {
        if (err) {
            next(err);
        } else {
            req.categories = rows;
            next();
        }
    });
};

var processContent = function (content) {
    return "<p>" + escapeHTML(content).replace(/\r\n|\r|\n/g, "</p><p>") + "</p>";
};

var checkCategory = function (uid, category, next, cb) {
    conn.query("select * from categories where uid=? and id=?",
    [uid, category], function (err, rows) {
        if (err) {
            next(err);
        } else if (rows.length === 1) {
            cb(category);
            updateCategory(category, next);
        } else {
            conn.query("select id from categories where uid=? and name=?",
            [uid, "默认分类"], function (err, rows) {
                if (err) {
                    next(err);
                } else if (rows.length === 1) {
                    cb(rows[0].id);
                    updateCategory(category, next);
                }
            });
        }
    });
};

var updateCategory = function (category, next) {
    conn.execute("update categories set blog_count=blog_count+1 where id=?",
        [category], function (err, result) {
            if (err) {
                next(err);
            }
        });
};

var addTags = function (id, tags, next) {
    var i, l = tags.length, count = 0;
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

exports.postBlog = function (req, res, next) {
    var uid = req.session.user.id,
    title = escapeHTML(req.body.title),
    content = processContent(req.body.content),
    category = req.body.category;
    tags = escapeHTML(req.body.tags).split(/\s+/g);
    
    req.uid = uid;
    
    var f1 = function (category) {
        conn.execute("insert into blogs (uid, title, content, category, created_time, last_modified) values (?, ?, ?, ?, now(), now())",
        [uid, title, content, category], function (err, result) {
            if (err) {
                next(err);
            } else {
                req.blogId = result.insertId;
                addTags(result.insertId, tags, next);
            }
        });
    };
    
    checkCategory(uid, category, next, f1);
};

exports.editBlog = function (req, res, next) {
    var id = req.body.id,
    uid = req.session.user.id,
    title = escapeHTML(req.body.title),
    content = processContent(req.body.content),
    category = req.body.category;
    tags = escapeHTML(req.body.tags).split(/\s+/g),
    count = 0;
    
    req.uid = uid;
    req.blogId = id;
    
    var f1 = function (category) {
        conn.query("select category from blogs where id=?",
        [id], function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length === 1) {
                conn.execute("update categories set blog_count=blog_count-1 where id=?",
                    [rows[0].category], function (err, result) {
                        if (err) {
                            next(err);
                        }
                    });
                conn.execute("update blogs set title=?, content=?, category=?, last_modified=now()",
                    [title, content, category], function (err, result) {
                        if (err) {
                            next(err);
                        }
                    });
                conn.execute("delete from tags where blog_id=?",
                    [id], function (err, result) {
                        if (err) {
                            next(err);
                        } else {
                            addTags(id, tags, next);
                        }
                    });
            } else {
                res.redirect("/blog/" + uid);
            }
        });
    };
    
    checkCategory(uid, category, next, f1);
};
