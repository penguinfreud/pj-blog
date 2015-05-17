var view = require("../server/view"),
lib = require("./lib");

exports.run = View(req) {
    var body = @{
        @lib.style('/css/edit.css');
        @lib.script('/scripts/edit.js');
        div#edit_blog.panel {
            div.panel_title {
                @'发博文';
            }
            div.panel_content {
                form#edit_form (action='/edit', method='POST') {
                    @'标题：';
                    br;
                    input (type='text', name='title');
                    br;
                    textarea (name='content') {}
                    br;
                    @'分类：';
                    select (name='category') {
                        var c = req.categories, i, l = c.length;
                        for (i = 0; i<l; i++) {
                            option (value=c[i].id, i === 0? 'selected': '') {
                                @c[i].name;
                            }
                        }
                    }
                    @' ';
                    a (href='#') {
                        @'创建分类';
                    }
                    br;
                    @'标签：';
                    input (type='text', name='tags', placeholder='填写标签，让更多人看到你的博文');
                    br;
                    input.button (type='submit', value='发博文');
                }
            }
        }
    };
    return view.render("layout", req, {
        title: '发博文',
        body: body
    });
};