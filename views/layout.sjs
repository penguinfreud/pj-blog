var view = require("../server/view"),
    lib = view.require("lib");

exports.run = View(req, data) {
    ## {
        var path = '/blog/' + req.user.id,
            title = req.user.nickname + '的博客',
            pageTitle = title;
        if (data.title) {
            pageTitle = data.title + " - " + pageTitle;
        }
    }
    html {
        head {
            @lib.title(pageTitle);
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
                @data.body;
            }
            div#footer {
                p { @'Copyright &copy; 2015 ' + req.user.nickname; }
                p { @req.user.nickname + '版权所有'; }
            }
        }
    }
};