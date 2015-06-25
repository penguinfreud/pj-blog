var view = require("./view"),
db = require("./database"),
validate = require("./validate");

app.get("/login", app.get("ifUnlogged"), function (req, res, next) {
    res.send(view.render("login"));
});

app.post("/login", app.get("ifUnlogged"), app.get("bodyParser"), function (req, res, next) {
    var body = req.body;
    if (body.type === "login") {
        db.login(req, res, next);
    } else if (body.type === "signup") {
        var msg = validate.validateSignup(body);
        if (msg) {
            res.send(view.render("login", msg));
        } else {
            db.signup(req, res, next);
        }
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function (req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        req.session.user = null;
        app.get("goto")(req, res, "/");
    }
});

app.get("/account", app.get("ifLogged"), function (req, res, next) {
    res.send(view.render("account", req));
});