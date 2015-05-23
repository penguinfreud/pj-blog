var express = require("express"),
session = require("cookie-session"),
view = require("./view"),
db = require("./database");

process.on("uncaughtException", function (err) {
    console.error(err.stack);
});

var app = express();

var ifUnlogged = function (req, res, next) {
    if (req.session.user) {
        res.redirect("/blog/" + req.session.user.id);
    } else {
        next();
    }
};

var ifLogged = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
};

var bodyParser = require("body-parser").urlencoded({ extended: false });

app.set("ifUnlogged", ifUnlogged);
app.set("ifLogged", ifLogged);
app.set("bodyParser", bodyParser);

app.use(session({
    name: "s",
    keys: ["igEskic7", "Grocnoahups2"]
}));

app.use(express.static(__dirname + "/../public"));

app.get("/", db.getBlogs(1, 1, 10),
    [db.getAuthors, db.getBlogCategories],
    function (req, res, next) {
        res.send(view.render("index", req));
    });

var getCategories = function (req, res, next) {
    db.getCategories(req.params.uid, req, res, next);
};

var getCategories2 = function (req, res, next) {
    db.getCategories(req.session.user.id, req, res, next);
};

app.get("/blog", function (req, res, next) {
    res.redirect("/");
});

app.get("/blog/:uid",
    [db.getUser,
    db.getBlogs(0, 1, 10),
    getCategories],
function (req, res, next) {
    res.send(view.render("userIndex", req));
});

app.get("/blog/:uid/category/:category_id", function (req, res, next) {
    res.send("category " + req.params.category_id);
});

app.get("/blog/:uid/blog_list",
    [db.getUser,
    db.getBlogs(0, 0, 20),
    getCategories],
function (req, res, next) {
    res.send(view.render("blogListPage", req));
});

app.get("/blog/:uid/entry/:blog_id",
        [db.getUser,
        db.getSingleBlog,
        db.getSingleCategory,
        db.getComments],
        [db.getPrevBlog,
        db.getNextBlog],
    function (req, res, next) {
        res.send(view.render("blog", req));
    });

app.get("/blog/:uid/tag/:tag_id", function (req, res, next) {
    res.send("tag " + req.params.blog_id);
});

app.get("/edit", ifLogged, getCategories2, function (req, res, next) {
    req.user = req.session.user;
    res.send(view.render("edit", req));
});

app.get("/blog/:uid/edit/:blog_id", ifLogged,
    [db.getSingleBlog, getCategories2],
    function (req, res, next) {
        req.user = req.session.user;
        res.send(view.render("edit", req));
    });

var redirectBlog = function (req, res, next) {
    res.redirect("/blog/" + req.uid + "/entry/" + req.blogId);
};

app.post("/post_blog", ifLogged, bodyParser,
    db.checkCategory,
    [db.incCategory,
    db.postBlog],
    db.addTags,
    redirectBlog);

app.post("/blog/:uid/edit/:blog_id", ifLogged, bodyParser,
    [db.checkAuthor,
    db.checkCategory],
    db.decCategory,
    db.editBlog,
    db.addTags,
    redirectBlog);

app.get("/blog/:uid/delete/:blog_id", ifLogged, db.checkPrivil, db.deleteBlog,
    function (req, res, next) {
        res.redirect("/blog/" + req.params.uid);
    });

app.post("/blog/:uid/entry/:blog_id/post_comment", bodyParser, db.postComment,
    function (req, res, next) {
        res.redirect("/blog/" + req.params.uid + "/entry/" + req.params.blog_id);
    });

app.post("/create_category", ifLogged, bodyParser, db.createCategory);

var redirectAccount = function (req, res, next) {
    res.redirect("/account");
};

require("./upload").init(app);

app.post("/modify_nickname", ifLogged, bodyParser, db.modifyNickname, redirectAccount);
app.post("/modify_password", ifLogged, bodyParser, db.modifyPassword, redirectAccount);
app.post("/modify_description", ifLogged, bodyParser, db.modifyDescription, redirectAccount);

require("./account").init(app);

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

app.listen(8080);
