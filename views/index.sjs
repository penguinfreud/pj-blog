var view = require("../server/view");

exports.run = function (req) {
    return view.render("layout", req, {
        nav: 0,
        bodyLeft: view.render("info", req) +
            view.render("categories", req),
        bodyRight: view.render("blogSummaryList", req)
    });
};
