var view = require("../server/view");

exports.run = View(req) {
    div#articlelist.panel {
        div.panel_title {
            @'博文';
        }
        div.panel_content {
            var b = req.blogs, i, l = b.length;
            for (i = 0; i<l; i++) {
                @view.render("blogSummary", req, b[i]);
            }
        }
    }
};