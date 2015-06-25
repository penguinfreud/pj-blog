var db = require("../database");
var conn = db.connection;

db.likeBlog = function (req, res, next) {
    conn.execute("insert into likes (uid, blog_id) values (?, ?)",
        [req.session.user.id, req.params.blog_id], function (err, result) {
            if (err) {
                next(err);
            } else {
                res.send();
            }
        });
};

db.cancelLikeBlog = function (req, res, next) {
    conn.execute("delete from likes where uid=? and blog_id=?",
        [req.session.user.id, req.params.blog_id], function (err, result) {
            if (err) {
                next(err);
            } else {
                res.send();
            }
        });
};
