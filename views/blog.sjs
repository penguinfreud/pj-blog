var view = require('../server/view'),
    lib = require('./lib');

exports.run = View(req) {
    var blog = req.blog,
        path = '/blog/' + req.user.id,
        blogPath = path + "/entry/" + blog.id;
    var body = @{
        @lib.style('/css/blog.css');
        div#articlelist.panel {
            div.panel_title {
                @'博文';
            }
            div.panel_content {
                div.blog {
                    div.blog_title {
                        span {
                            @blog.title;
                        }
                        span.blog_timestamp {
                            @'('; @lib.formatTime(blog.created_time); @')';
                        }
                    }
                    div.blog_tags {
                        span {
                            @'标签：';
                        }
                        var tags = blog.tags, i, l = tags.length;
                        for (i = 0; i<l; i++) {
                            @' ';
                            a (href=path + '/tag/' + tags[i].id) {
                                @tags[i].name;
                            }
                        }
                        @' ';
                        span {
                            @'分类：';
                            a (href=path + '/category/' + blog.category) {
                                @lib.getCategoryName(req.categories, blog.category);
                            }
                        }
                    }
                    div.blog_content {
                        @blog.content;
                    }
                    div.blog_operations {
                        span {
                            @'阅读('; @blog.read_count; @')';
                        }
                        @' | ';
                        a (href='#comments') {
                            @'评论('; @blog.comment_count; @')';
                        }
                    }
                }
            }
        }
    };
    return view.render('layout', req, {
        nav: 1,
        title: blog.title,
        body: body
    });
};