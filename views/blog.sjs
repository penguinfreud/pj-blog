var view = require('../server/view'),
    lib = view.require('lib');

exports.run = View(req) {
    var path = '/blog/' + req.params.uid;
    var body = @{
        @lib.style('/css/blog.css');
        @lib.script('/scripts/jquery-2.1.4.min.js');
        @lib.script('/scripts/blog.js');
        div#articlelist.panel {
            div.panel_title {
                @'博文';
            }
            div.panel_content {
                div.blog {
                    @view.render("blogSummary", req, req.blog, 1);
                    div.blog_comments {
                        h3 {
                            a (name='comments') {}
                            @'评论';
                        }
                        var comments = req.comments,
                            i, l = comments.length,
                            hasPrivil = lib.hasPrivil(req, req.blog);
                        for (i = 0; i<l; i++) {
                            var comment = comments[i];
                            div.comment {
                                div.comment_user {
                                    a (href=comment.uid? '/blog/' + comment.uid: 'mailto:' + comment.email) {
                                        @comment.name;
                                    }
                                }
                                div.comment_content {
                                    @lib.processContent(comment.content);
                                }
                                div.comment_bottom {
                                    span.comment_timestamp {
                                        @lib.formatTime(comment.created_time);
                                    }
                                    if (hasPrivil) {
                                        span.comment_operations {
                                            a.del (href=path + '/entry/' + req.blog.id +
                                                '/delete_comment/' + comment.id) {
                                                @'删除';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    div.blog_post_comment {
                        form#comment_form (action=path + '/entry/' +
                            req.params.blog_id + '/post_comment',
                            method='POST') {
                            h3 {
                                @'发评论';
                            }
                            div {
                                textarea (name='content') {}
                            }
                            if (!req.session.user) {
                                div {
                                    @'邮箱：';
                                    input (type='text', name='email');
                                    @'&nbsp;&nbsp;&nbsp;昵称：';
                                    input (type='text', name='name');
                                }
                            }
                            div {
                                input.button (type='submit', value='发评论');
                            }
                        }
                    }
                    if (req.prevBlog) {
                        div.blog_nav_prev {
                            div {
                                @'&lt;前一篇';
                            }
                            div {
                                a (href=path + '/entry/' + req.prevBlog.id) {
                                    @req.prevBlog.title;
                                }
                            }
                        }
                    }
                    if (req.nextBlog) {
                        div.blog_nav_next {
                            div {
                                @'后一篇&gt;';
                            }
                            div {
                                a (href=path + '/entry/' + req.nextBlog.id) {
                                    @req.nextBlog.title;
                                }
                            }
                        }
                    }
                    div.clear {}
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