var db = require("../database"),
escapeHTML = require("escape-html");
var conn = db.connection;

db.getComments = function (req, res, next) {
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

db.postComment = function (req, res, next) {
    var cb = function (err, result) {
        if (err) {
            next(err);
        } else {
            next();
        }
    };
    
    var body = req.body;
    if (req.session.user) {
        conn.execute("insert into comments (blog_id, uid, content, created_time) values (?, ?, ?, now())",
            [req.params.blog_id, req.session.user.id, body.content], cb);
    } else {
        var email = escapeHTML(body.email),
            name = escapeHTML(body.name);
        conn.execute("insert into comments (blog_id, email, name, content, created_time) values (?, ?, ?, ?, now())",
            [req.params.blog_id, email, name, body.content], cb);
    }
};

db.checkCommentPrivil = function (req, res, next) {
    conn.query("select uid, category from blogs where id=? and uid=?",
    [req.params.blog_id, req.params.uid], function (err, rows) {
        if (err) {
            next(err);
        } else if (rows.length === 1) {
            if (rows[0].uid === req.session.user.id ||
                req.session.user.type === 2) {
                next();
            } else {
                conn.query("select uid from comments where id=? and blog_id=?",
                [req.params.comment_id, req.params.blog_id], function (err, rows) {
                    if (err) {
                        next(err);
                    } else if (rows.length === 1) {
                        if (rows[0].uid === req.session.user.id) {
                            next();
                        } else {
                            next(new Error("You don't have privilege"));
                        }
                    } else {
                        next(new Error("The comment does not exist"));
                    }
                });
            }
        } else {
            next(new Error("The blog does not exist"));
        }
    });
};

db.deleteComment = function (req, res, next) {
    conn.execute("delete from comments where id=?",
        [req.params.comment_id], function (err, result) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
};

db.incComment = function (req, res, next) {
    conn.execute("update blogs set comment_count=comment_count+1 where id=?",
        [req.params.blog_id], function (err, result) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
};

db.decComment = function (req, res, next) {
    conn.execute("update blogs set comment_count=comment_count-1 where id=?",
        [req.params.blog_id], function (err, result) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
};