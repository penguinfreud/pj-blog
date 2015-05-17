var view = require("../server/view");

exports.run = View(req) {
    var body = @{
        div#body_left {
            @view.render("info", req);
            @view.render("categories", req);
        }
        div#body_right {
            @view.render("blogSummaryList", req);
        }
    };
    return view.render("layout", req, {
        nav: 0,
        body: body
    });
};
