var getCategoryName = function (categories, id) {
    var i = categories.length;
    while (i--) {
        if (categories[i].id === id) {
            return categories[i].name;
        }
    }
    return "";
};

exports.run = View(req, blog) {
    var path = '/blog/' + req.user.id,
        blogPath = path + "/entry/" + blog.id;
    div.blog {
        div.blog_title {
            a (href=blogPath) {
                @blog.title;
            }
            span.blog_timestamp {
                @'('; @blog.created_time.toLocaleString(); @')';
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
            span {
                @'分类：';
                a (href=path + '/category/' + blog.category) {
                    @getCategoryName(blog.category);
                }
            }
        }
        div.blog_content {
            @blog.content;
        }
        div.blog_operations {
            a (href=blogPath) {
                @'阅读('; @blog.read_count; ')';
            }
            @' | ';
            a (href=blogPath + '#comments') {
                @'评论('; @blog.comment_count; ')';
            }
            a.align_right (href=blogPath) {
                @'查看全文&gt;&gt;';
            }
        }
    }
};