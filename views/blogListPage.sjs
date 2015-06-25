var view = require("../server/view"),
    lib = view.require("lib");

exports.run = View(req, type) {
    var path = '/blog/' + req.user.id;
    var body = @{
        @lib.jquery(req);
        @lib.scriptOnce(req, '/scripts/delete.js');
        if (req.session.user && req.session.user.id === parseInt(req.params.uid)) {
            a#post_blog.align_right (href='/edit') {
                @'发博文';
            }
        }
        div.clear {}
        div#body_left {
            @view.render("categories", req);
            @view.render("searchBox", req);
        }
        div#body_right {
            div#articlelist.panel {
                div.panel_title {
                    if (type === 1) {
                        @'全部博文';
                    } else if (type === 2) {
                        var categoryName = lib.getCategoryName(req.categories, parseInt(req.params.category_id));
                        @'分类：';
                        @categoryName;
                        if (categoryName !== '默认分类') {
                            div.align_right {
                                a#rename_category.f (href='#') {
                                    @'重命名';
                                }
                                @' ';
                                a.f.del (href='/delete_category/' + req.params.category_id, 'data-obj'='分类' + categoryName) {
                                    @'删除';
                                }
                            }
                            script {
                                @'var categoryId=';
                                @req.params.category_id;
                                @',categoryName=';
                                @JSON.stringify(categoryName);
                                @';';
                            }
                            @lib.script('/scripts/category.js');
                        }
                    } else if (type === 3) {
                        @'标签：';
                        @req.params.tag;
                    }
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
                    @lib.pagination(req.blogsPaging);
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
