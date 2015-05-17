var view = require("../server/view");

var hasPrivil = function (req) {
    return req.session.user.id === req.user.id? 1:
        req.session.user.type === 2? 2: 0;
};

exports.run = View(req) {
    var path = '/blog/' + req.user.id;
    var body = @{
        a#post_blog.align_right (href='/edit') {
            @'发博文';
        }
        div.clear {}
        div#body_left {
            @view.render("categories", req);
        }
        div#body_right {
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
                                            if (hasPrivil(req) === 1) {
                                                a.edit_blog (href='/edit/' + blogs[i].id) {
                                                    @'编辑';
                                                }
                                            }
                                            a.delete_blog (href='/delete/' + blogs[i].id +
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
        }
    };
    
    return view.render("layout", req, {
        nav: 1,
        title: "博客目录",
        body: body
    });
};
