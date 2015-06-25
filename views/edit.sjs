var view = require("../server/view"),
    lib = view.require("lib"),
    escapeHTML = require("escape-html");

exports.run = View(req) {
    var blog = req.blog, i, l;
    var body = @{
        @lib.style('/css/edit.css');
        @lib.jquery(req);
        @lib.script('/scripts/edit.js');
        @lib.script('/scripts/validate.js');
        div#edit_blog.panel {
            div.panel_title {
                @blog? '编辑': '发博文';
            }
            div.panel_content {
                var action = blog? '/blog/' + blog.uid + '/edit/' + blog.id: '/post_blog';
                form#edit_form (action=action, method='POST') {
                    @'标题：';
                    br;
                    input (type='text', name='title', value=blog? blog.title: '');
                    br;
                    textarea (name='content') {
                        if (blog) {
                            @escapeHTML(blog.content);
                        }
                    }
                    br;
                    @'分类：';
                    select (name='category') {
                        var c = req.categories, selected;
                        for (i = 0, l = c.length; i<l; i++) {
                            ## {
                                selected = blog? c[i].id === blog.category: i === 0;
                            }
                            option (value=c[i].id, selected? 'selected': '') {
                                @c[i].name;
                            }
                        }
                    }
                    @' ';
                    span#create_category_panel {
                        input#category_input (type='text');
                        @' ';
                        a#create_category_ok.button (href='#') {
                            @'确认';
                        }
                        a#create_category_cancel.button (href='#') {
                            @'取消';
                        }
                        a#create_category_btn.button (href='#') {
                            @'创建分类';
                        }
                    }
                    p {
                        @'标签：';
                        span.small { @'（空格分隔）'; }
                        ## {
                            if (blog) {
                                var sTags = [], tags = blog.tags;
                                for (i = 0, l = tags.length; i<l; i++) {
                                    sTags.push(tags[i].name);
                                }
                            }
                        }
                        input (type='text', name='tags', value=blog? sTags.join(' '): '');
                    }
                    p {
                        input.button (type='submit', value=blog? '保存': '发博文');
                    }
                }
            }
        }
    };
    return view.render("layout", req, {
        title: blog? '编辑 ' + blog.title: '发博文',
        body: body
    });
};