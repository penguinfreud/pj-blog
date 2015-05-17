var lib = require("./lib");

exports.run = View(req, data) {
    ## {
        var path = '/blog/' + req.user.id,
            title = req.user.nickname + '的博客';
        if (data.title) {
            title = data.title + " - " + title;
        }
    }
    html {
        head {
            @lib.title(title);
            @lib.style('/css/ui.css');
            @lib.style('/css/main.css');
        }
        body {
            div#toolbar {
                span {
                    if (req.session.user) {
                        a (href='/blog/' + req.session.user.id) {
                            @req.session.user.nickname + '的博客';
                        }
                        @' ';
                        a (href='/logout?goto=' + path) {
                            @'退出';
                        }
                    } else {
                        a (href='/login') {
                            @'登录';
                        }
                    }
                }
            }
            div#header {
                div#title {
                    h1#name {
                        a (href='#') {
                            @title;
                        }
                    }
                    div#link {
                        a (href='#') {
                            @'http://localhost' + path;
                        }
                    }
                }
                div#nav {
                    span {
                        a (href=path, (data.nav === 0? 'class="current"': '')) { @'主页'; }
                    }
                    @'|';
                    span {
                        a (href=path + '/blog_list', (data.nav === 1? 'class="current"': '')) { @'博客目录'; }
                    }
                }
            }
            div#body {
                if (data.nav === 1) {
                    a#post_blog.align_right (href=path + '/edit') {
                        @'发博文';
                    }
                    div.clear {}
                }
                div#body_left {
                    @data.bodyLeft;
                }
                div#body_right {
                    @data.bodyRight;
                }
            }
            div#footer {
                p { @'Copyright &copy; 2015 ' + req.user.nickname; }
                p { @req.user.nickname + '版权所有'; }
            }
        }
    }
};