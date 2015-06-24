exports.run = View(req) {
    ## {
        var c = req.categories, i, l = c.length, sum = 0;
        for (i = 0; i<l; i++) {
            sum += c[i].blog_count;
        }
    }
    div#categories.panel {
        div.panel_title {
            @'分类';
        }
        div.panel_content {
            ul {
                li {
                    a (href='/blog/' + req.user.id + "/blog_list") {
                        @'全部博文';
                    }
                    span {
                        @'(';
                        @sum;
                        @')';
                    }
                }
                for (i = 0; i<l; i++) {
                    li {
                        a (href='/blog/' + req.user.id + '/category/' + c[i].id) {
                            @c[i].name;
                        }
                        span {
                            @'(';
                            @c[i].blog_count;
                            @')';
                        }
                    }
                }
            }
        }
    }
};