var view = require("../server/view"),
    lib = view.require("lib");

exports.run = View(req, data) {
    ## {
        var path, title, pageTitle;
        if (req.user) {
            path = '/blog/' + req.user.id;
            title = req.user.nickname + '的博客';
            pageTitle = title;
            if (data.title) {
                pageTitle = data.title + " - " + pageTitle;
            }
        } else {
            pageTitle = data.title;
        }
    }
    html {
        head {
            @lib.title(pageTitle);
            @lib.style('/css/ui.css');
            @lib.style('/css/main.css');
        }
        body {
            @lib.toolbar(req);
            if (!data.omitHeader) {
                div#header {
                    
                    div#title {
                        h1#name {
                            a.f (href=path) {
                                @title;
                            }
                        }
                        div#link {
                            a.f (href=path) {
                                @'http://localhost' + path;
                            }
                        }
                    }
                    div#nav {
                        span {
                            a (href=path, 'class'=(data.nav === 0? 'current f': 'f')) { @'主页'; }
                        }
                        @'|';
                        span {
                            a (href=path + '/blog_list', 'class'=(data.nav === 1? 'current f': 'f')) { @'博客目录'; }
                        }
                    }
                }
            }
            div#body {
                @data.body;
            }
            if (!data.omitHeader) {
                div#footer {
                    p { @'Copyright &copy; 2015 ' + req.user.nickname; }
                    p { @req.user.nickname + '版权所有'; }
                }
            }
        }
    }
};