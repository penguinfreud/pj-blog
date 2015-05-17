var view = require('../server/view'),
    lib = view.require('lib');

exports.run = View(req) {
    var body = @{
        @lib.style('/css/blog.css');
        div#articlelist.panel {
            div.panel_title {
                @'博文';
            }
            div.panel_content {
                div.blog {
                    @view.render("blogSummary", req, req.blog, true);
                }
            }
        }
    };
    return view.render('layout', req, {
        nav: 1,
        title: req.blog.title,
        body: body
    });
};