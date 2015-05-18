var cp = require("child_process"),
    fs = require("fs"),
    db = require("./database");

exports.init = function (app) {
    app.post("/modify_icon", app.get("ifLogged"), require("multer")({
        dest: __dirname + "/../uploads/",
        limits: {
            files: 2,
            fileSize: 1 << 20
        }
    }), function (req, res, next) {
        var uid = req.session.user.id,
            icon = uid + ".png",
            path = req.files.icon.path;
        cp.exec("convert " + path + " -resize 96x96 public/icons/" + icon,
            function (err, stdout, stderr) {
                if (err) {
                    next(err);
                } else {
                    req.uid = uid;
                    req.icon = icon;
                    next();
                    fs.unlink(path, function (err) {
                        if (err) {
                            console.log(err.stack);
                        }
                    });
                }
            });
    }, db.modifyIcon, function (req, res, next) {
        res.redirect("/account");
    });
};