var view = require("./view"),
db = require("./database");

exports.init = function (app) {
    app.get("/login", app.get("ifUnlogged"), function (req, res, next) {
        res.send(view.render("login"));
    });

    app.post("/login", app.get("ifUnlogged"), app.get("bodyParser"), function (req, res, next) {
        var params = req.body;
        if (params.type === "login") {
            db.connection.query("select * from users where username=? and password=password(?)",
            [params.username, params.password],
            function (err, rows) {
                if (err) {
                    console.error(err.stack);
                } else if (rows.length === 1) {
                    req.session.user = rows[0];
                    res.redirect("/");
                } else {
                    res.send(view.render("login"));
                }
            });
        } else if (params.type === "signup") {
            var username = params.username,
                password = params.password,
                nickname = params.nickname || username,
                msg;
            if (username === "") {
                msg = "用户名不能为空";
            } else if (username.length < 2) {
                msg = "用户名太短";
            } else if (username.length > 14) {
                msg = "用户名太长";
            } else if (/[^A-Za-z0-9_]/.test(username)) {
                msg = "用户名只能包含英文字母、数字、下划线";
            } else if (password === "") {
                msg = "密码不能为空";
            } else if (password.length < 6) {
                msg = "密码太短";
            } else if (username.length > 25) {
                msg = "密码太长";
            } else if (/[^\x20-\x7e]/.test(password)) {
                msg = "密码含有非法字符";
            } else if (/^[0-9]+$/.test(password)) {
                msg = "密码不能只包含数字";
            } else if (params.confirm_password !== password) {
                msg = "重复密码不一致";
            }
            if (msg) {
                res.send(view.render("login", msg));
            }
            db.connection.query("select id from users where username=?",
            [username], function (err, rows) {
                if (err) {
                    console.error(err.stack);
                } else if (rows.length > 0) {
                    res.send(view.render("login", "该用户名已被注册"));
                } else {
                    db.connection.execute("insert into users (username, password, nickname, type) values (?, password(?), ?, 1)",
                    [username, password, nickname],
                    function (err, result) {
                        if (err) {
                            console.log(err.stack);
                            res.send(view.render("login", "注册失败"));
                        } else {
                            db.connection.execute("insert into categories (name, uid) values ('默认分类', ?)",
                            [result.insertId], function (err, result) {
                                if (err) {
                                    console.log(err.stack);
                                }
                            });
                            req.session.user = {
                                id: result.insertId,
                                username: username,
                                password: "",
                                nickname: nickname,
                                type: 1,
                                description: null,
                                icon: "default.png" 
                            };
                            next();
                        }
                    });
                }
            });
        } else {
            res.send(view.render("login"));
        }
    }, app.get("ifUnlogged"));
    
    app.get("/logout", function (req, res, next) {
        if (!req.session.user) {
            res.redirect("/login");
        } else {
            req.session.user = null;
            if (/^\/[a-z]/i.test(req.query.goto)) {
                res.redirect(req.query.goto);
            } else {
                res.redirect("/");
            }
        }
    });
};