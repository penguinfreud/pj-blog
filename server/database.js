var mysql = require("mysql2"),
escapeHTML = require("escape-html"),
validate = require("./validate");

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
        req.start = start;
        
        conn.query("select id, uid, title" +
            (hasContent? ", substr(content, 1, 250) as content": "") +
            ", created_time, category, read_count, like_count, comment_count from blogs where uid=? order by created_time desc limit ? offset ?",
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

exports.getPrevBlog = function (req, res, next) {
    conn.query("select id, title from blogs where created_time<? and uid=? order by created_time asc limit 1",
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

exports.getNextBlog = function (req, res, next) {
    conn.query("select id, title from blogs where created_time>? and uid=? order by created_time desc limit 1",
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

exports.getComments = function (req, res, next) {
    var start = parseInt(req.query.start);
    if (!isFinite(start) || start < 0) {
        start = 0;
    }
    req.commentsStart = start;
    
    conn.query("select * from comments where blog_id=? limit 50 offset ?",
        [req.params.blog_id, start], function (err, rows) {
            if (err) {
                next(err);
            } else {
                req.comments = rows;
                
                var count = 0, total = 0;
                rows.forEach(function (comment) {
                    if (comment.uid) {
                        total++;
                        conn.query("select username from users where id=?",
                            [comment.uid], function (err, rows) {
                                if (err) {
                                    next(err);
                                } else {
                                    if (rows.length === 1) {
                                        comment.name = rows[0].username;
                                    } else {
                                        comment.name = "[已注销]";
                                    }
                                    if (++count === total) {
                                        next();
                                    }
                                }
                            });
                    }
                });
                if (total === 0) {
                    next();
                }
            }
        });
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
    content = req.body.content,
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
    content = req.body.content,
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

exports.login = function (req, res, next) {
    conn.query("select * from users where username=? and password=password(?)",
        [req.body.username, req.body.password],
        function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length === 1) {
                req.session.user = rows[0];
                res.redirect("/");
            } else {
                res.send(view.render("login", "用户名或密码错误"));
            }
        });
};

exports.signup = function (req, res, next) {
    var body = req.body;
    conn.query("select id from users where username=?",
        [body.username], function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length > 0) {
                res.send(view.render("login", "该用户名已被注册"));
            } else {
                conn.execute("insert into users (username, password, nickname, type) values (?, password(?), ?, 1)",
                [body.username, body.password, body.nickname],
                function (err, result) {
                    if (err) {
                        next(err);
                    } else {
                        conn.execute("insert into categories (name, uid) values ('默认分类', ?)",
                        [result.insertId], function (err, result) {
                            if (err) {
                                console.log(err.stack);
                            }
                        });
                        req.session.user = {
                            id: result.insertId,
                            username: body.username,
                            password: "",
                            nickname: body.nickname,
                            type: 1,
                            description: null,
                            icon: "default.png" 
                        };
                        next();
                    }
                });
            }
        });
};

exports.modifyIcon = function (req, res, next) {
    conn.execute("update users set icon=? where id=?",
        [req.icon, req.uid], function (err, result) {
            if (err) {
                next(err);
            } else {
                req.session.user.icon = req.icon;
                next();
            }
        });
};

exports.modifyNickname = function (req, res, next) {
    var nickname = escapeHTML(req.body.nickname);
    if (nickname) {
        conn.execute("update users set nickname=? where id=?",
            [nickname, req.session.user.id], function (err, result) {
                if (err) {
                    next(err);
                } else {
                    req.session.user.nickname = req.body.nickname;
                    next();
                }
            });
    } else {
        next();
    }
};

exports.modifyPassword = function (req, res, next) {
    var password = req.body.password,
        msg = validate.validatePassword(password, req.body.confirm_password);
    if (msg) {
        res.send(msg);
    } else {
        conn.execute("update users set password=password(?) where id=?",
            [password, req.session.user.id], function (err, result) {
                if (err) {
                    next(err);
                } else {
                    next();
                }
            });
    }
};

exports.modifyDescription = function (req, res, next) {
    conn.execute("update users set description=? where id=?",
        [req.body.description, req.session.user.id], function (err, result) {
            if (err) {
                next(err);
            } else {
                req.session.user.description = req.body.description;
                next();
            }
        });
};
