var db = require("../database"),
view = require("../view"),
validate = require("../validate"),
escapeHTML = require("escape-html");
var conn = db.connection;

db.login = function (req, res, next) {
    conn.query("select * from users where username=? and password=password(?)",
        [req.body.username, req.body.password],
        function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length === 1) {
                req.session.user = rows[0];
                res.redirect("/");
            } else {
                res.send(view.render("login", "用户名或密码错误", false));
            }
        });
};

db.signup = function (req, res, next) {
    var body = req.body;
    conn.query("select id from users where username=?",
        [body.username], function (err, rows) {
            if (err) {
                next(err);
            } else if (rows.length > 0) {
                res.send(view.render("login", "该用户名已被注册", true));
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

db.modifyIcon = function (req, res, next) {
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

db.modifyNickname = function (req, res, next) {
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

db.modifyPassword = function (req, res, next) {
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

db.modifyDescription = function (req, res, next) {
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
