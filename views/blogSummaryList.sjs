var view = require("../server/view"),
    lib = view.require("lib");

exports.run = View(req, allUser) {
    div#articlelist.panel {
        div.panel_title {
            @'博文';
        }
        div.panel_content {
            var b = req.blogs, i, l = b.length;
            for (i = 0; i<l; i++) {
                div.blog {
                    @view.render("blogSummary", req, b[i], allUser? 2: 0);
                }
            }
            @lib.pagination(req.blogsPaging);
        }
    }
};