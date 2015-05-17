var express = require("express"),
session = require("cookie-session"),
view = require("./view"),
defer = require("../lib/defer"),
db = require("./database");

process.on("uncaughtException", function (err) {
    console.error(err.stack);
});

var app = express();

app.set("loginCheck", function (req, res, next) {
    if (req.session.user) {
        res.redirect("/blog/" + req.session.user.id);
    } else {
        next();
    }
});

app.use(session({
    name: "s",
    keys: ["igEskic7", "Grocnoahups2"]
}));

app.use(express.static(__dirname + "/../public"));

var loginCheck = function (req, res, next) {
    res.redirect("/login");
};

app.get("/", app.get("loginCheck"), loginCheck);

var getCategories = function (req, res, next) {
    db.getCategories(req.params.id, req, next);
};

app.get("/blog/:uid",
    [db.getUser,
    db.getBlogs(1, 10),
    db.getCategories],
function (req, res, next) {
    res.send(view.render("index", req));
});

app.get("/blog/:uid/category/:category_id", function (req, res, next) {
    res.send("category " + req.params.category_id);
});

app.get("/blog/:uid/blog_list",
    [db.getUser,
    db.getBlogs(0, 20),
    db.getCategories],
function (req, res, next) {
    res.send(view.render("blogListPage", req));
});

app.get("/blog/:uid/entry/:blog_id", function (req, res, next) {
    res.send("blog " + req.params.blog_id);
});

app.get("/blog/:uid/tag/:tag_id", function (req, res, next) {
    res.send("tag " + req.params.blog_id);
});

app.get("/blog/:uid/edit", loginCheck, function (req, res, next) {
    res.send(view.render("edit", req));
});

require("./account").init(app);

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

app.listen(8080);
