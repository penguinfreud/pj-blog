var view = require("../server/view"),
    lib = view.require("lib");

exports.run = View(req, blog, type) {
    var path = '/blog/' + blog.uid,
        blogPath = path + "/entry/" + blog.id;
    if (type === 2) {
        div {
            a (href=path) {
                @lib.getNickname(req.users, blog.uid);
            }
            @'发表了';
        }
    }
    div {
        if (type === 1) {
            span.blog_title {
                @blog.title;
            }
        } else {
            a.blog_title (href=blogPath) {
                @blog.title;
            }
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
            a (href=path + '/tag/' + encodeURIComponent(tags[i].name)) {
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
        @lib.processContent(blog.content);
    }
    div.blog_operations {
        if (type === 1) {
            span {
                @'阅读('; @blog.read_count; @')';
            }
        } else {
            a (href=blogPath) {
                @'阅读('; @blog.read_count; @')';
            }
        }
        @' | ';
        a (href=blogPath + '#comments') {
            @'评论('; @blog.comment_count; @')';
        }
        
        @lib.blogOperations(req, blog, ' | ');
        
        if (type !== 1) {
            a.align_right (href=blogPath) {
                @'查看全文&gt;&gt;';
            }
        }
    }
};