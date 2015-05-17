var view = require("../server/view"),
    lib = view.require("lib");

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
                                        @lib.formatTime(blogs[i].created_time);
                                    }
                                    span.blog_operations {
                                        lib.blogOperations(req, blogs[i], ' ');
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
