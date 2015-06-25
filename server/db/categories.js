var db = require("../database");
var conn = db.connection;

db.getDefaultCategory = function (req, res, next) {
    conn.query("select id from categories where uid=? and name=?",
        [req.session.user.id, "默认分类"], function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length === 1) {
                req.body.category = rows[0].id;
                next();
            } else {
                next(new Error("No proper category"));
            }
        });
};

db.getCategories = function (uid, req, res, next) {
    conn.query("select * from categories where uid=?",
        [uid], function (err, rows) {
            if (err) {
                next(err);
            } else {
                req.categories = rows;
                next();
            }
        });
};

db.createCategory = function (req, res, next) {
    var name = req.body.name;
    if (name) {
        conn.execute("insert into categories (uid, name) values (?, ?)",
        [req.session.user.id, name], function (err, result) {
            if (err) {
                console.error(err.stack);
                res.send();
            } else {
                res.send("" + result.insertId);
            }
        });
    } else {
        res.send();
    }
};

db.renameCategory = function (req, res, next) {
    var name = req.body.name;
    if (name) {
        conn.query("select name from categories where id=? and uid=?",
        [req.body.id, req.session.user.id], function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length === 1) {
                if (rows[0].name === "默认分类") {
                    res.send();
                } else {
                    conn.execute("update categories set name=? where id=?",
                    [name, req.body.id], function (err, result) {
                        if (err) {
                            next(err);
                        } else {
                            res.send();
                        }
                    });
                }
            } else {
                res.send();
            }
        });
    } else {
        res.send();
    }
};

db.deleteCategory = function (req, res, next) {
    var category = req.params.category_id;
    conn.query("select name, blog_count from categories where id=? and uid=?",
    [category, req.session.user.id], function (err, rows) {
        if (err) {
            next(err);
        } else if (rows.length === 1) {
            if (rows[0].name === "默认分类") {
                next(new Error("不能删除默认分类"));
            } else {
                var blogCount = rows[0].blog_count;
                conn.execute("update categories set blog_count=blog_count+? where id=?",
                [blogCount, req.body.category], function (err, result) {
                    if (err) {
                        console.error(err.stack);
                    }
                });
                conn.execute("update blogs set category=? where category=?",
                [req.body.category, category], function (err, result) {
                    if (err) {
                        next(err);
                    } else {
                        conn.execute("delete from categories where id=?",
                            [category], function (err, result) {
                                if (err) {
                                    next(err);
                                } else {
                                    res.redirect("/blog/" + req.session.user.id + "/blog_list");
                                }
                            });
                    }
                });
            }
        }
    });
};

db.getSingleCategory = function (req, res, next) {
    conn.query("select * from categories where id=(select category from blogs where id=?)",
    [req.params.blog_id], function (err, rows) {
        if (err) {
            next(err);
        } else {
            req.categories = rows;
            next();
        }
    });
};

db.checkCategory = function (req, res, next) {
    var uid = req.session.user.id;
    conn.query("select * from categories where uid=? and id=?",
    [uid, req.body.category], function (err, rows) {
        if (err) {
            next(err);
        } else if (rows.length === 1) {
            next();
        } else {
            db.getDefaultCategory(req, res, next);
        }
    });
};

db.incCategory = function (req, res, next) {
    conn.execute("update categories set blog_count=blog_count+1 where id=?",
        [req.body.category], function (err, result) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
};

db.decCategory = function (req, res, next) {
    conn.execute("update categories set blog_count=blog_count-1 where id=?",
        [req.oldCategory], function (err, result) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
}
