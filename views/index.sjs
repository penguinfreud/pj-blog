var view = require("../server/view"),
    lib = view.require("lib");

exports.run = View(req) {
    html {
        head {
            @lib.title('博客');
            @lib.style('/css/ui.css');
            @lib.style('/css/main.css');
        }
        body {
            @lib.toolbar(req);
            div#body {
                @view.render("blogSummaryList", req, 1);
            }
        }
    }
};