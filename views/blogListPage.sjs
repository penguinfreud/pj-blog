var view = require("../server/view");

var hasPrivil = function (req) {
    return req.session.user.id === req.user.id ||
        req.session.user.type === 2;
};

exports.run = View(req) {
    var path = '/blog/' + req.user.id;
    var bodyRight = @{
        div#articlelist.panel {
            div.panel_title {
                @'全部博文';
            }
            div.panel_content {
                ul#article_list_compact {
                    var blogs = req.blogs, i, l = blogs.length;
                    for (i = 0; i<l; i++) {
                        li {
                            a (href=path + '/entry/' + blogs[i].id) {
                                @blogs[i].title;
                            }
                            span.align_right {
                                span.blog_timestamp {
                                    @blogs[i].created_time.toLocaleString();
                                }
                                if (hasPrivil(req)) {
                                    span.blog_operations {
                                        a.edit_blog (href=path + '/edit/' + blogs[i].id) {
                                            @'编辑';
                                        }
                                        a.delete_blog (href=
                                                path + '/delete/' + blogs[i].id +
                                                '?goto=' + path + '/blog_list') {
                                            @'删除';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    
    return view.render("layout", req, {
        nav: 1,
        title: "博客目录",
        bodyLeft: view.render("categories", req),
        bodyRight: bodyRight
    });
};
