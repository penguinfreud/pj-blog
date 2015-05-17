var express = require("express"),
session = require("cookie-session"),
view = require("./view"),
defer = require("../lib/defer"),
db = require("./database");

process.on("uncaughtException", function (err) {
    console.error(err.stack);
});

var app = express();

app.set("ifUnlogged", function (req, res, next) {
    if (req.session.user) {
        res.redirect("/blog/" + req.session.user.id);
    } else {
        next();
    }
});

app.set("ifLogged", function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
});

app.set("bodyParser", require("body-parser").urlencoded({ extended: false }));

app.use(session({
    name: "s",
    keys: ["igEskic7", "Grocnoahups2"]
}));

app.use(express.static(__dirname + "/../public"));

app.get("/", app.get("ifUnlogged"), function (req, res, next) {
    res.redirect("/login");
});

var getCategories = function (req, res, next) {
    db.getCategories(req.params.uid, req, res, next);
};

app.get("/blog/:uid",
    [db.getUser,
    db.getBlogs(1, 10),
    getCategories],
function (req, res, next) {
    res.send(view.render("index", req));
});

app.get("/blog/:uid/category/:category_id", function (req, res, next) {
    res.send("category " + req.params.category_id);
});

app.get("/blog/:uid/blog_list",
    [db.getUser,
    db.getBlogs(0, 20),
    getCategories],
function (req, res, next) {
    res.send(view.render("blogListPage", req));
});

app.get("/blog/:uid/entry/:blog_id", function (req, res, next) {
    res.send("blog " + req.params.blog_id);
});

app.get("/blog/:uid/tag/:tag_id", function (req, res, next) {
    res.send("tag " + req.params.blog_id);
});

app.get("/edit", app.get("ifLogged"), function (req, res, next) {
    db.getCategories(req.session.user.id, req, res, next);
}, function (req, res, next) {
    req.user = req.session.user;
    res.send(view.render("edit", req));
});

app.post("/create_category", app.get("ifLogged"), app.get("bodyParser"), db.createCategory);

require("./account").init(app);

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

app.listen(8080);
