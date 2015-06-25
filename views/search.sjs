var view = require("../server/view"),
lib = view.require("lib");

var sortOption = View(data, name, val) {
    if (data.sort === val) {
        span {
            @name;
        }
    } else {
        a.sort_option (href='#', 'data-val'=val) {
            @name;
        }
    }
};

exports.run = View(req) {
    var body = @{
        @lib.jquery(req);
        @lib.script('/scripts/search.js');
        div.panel {
            div.panel_title {
                @'搜索';
            }
            div.panel_content {
                var uidQuery = (req.query.uid? '?uid=' + req.query.uid: ''),
                data = req.data || {
                    query: '',
                    position: 'title',
                    wholeSite: true,
                    sort: 'latest'
                },
                s = 'checked="true"';
                form#search_form (action='/search' + uidQuery, method='post') {
                    input#long_search_input (type='text', name='query', value=data.query);
                    input.button (type='submit', value='搜索');
                    br;
                    if (req.query.uid) {
                        label {
                            input (type='radio', name='whole_site', value='on',
                                data.wholeSite? s: '');
                            @'全站';
                        }
                        @' ';
                        label {
                            input (type='radio', name='whole_site', value='off',
                                data.wholeSite? '': s);
                            @req.user.nickname; @'的博客';
                        }
                        br;
                    } else {
                        input (type='hidden', name='whole_site', value='on');
                    }
                    label {
                        input (type='radio', name='position', value='title',
                            data.position === 'title'? s: '');
                        @'标题';
                    }
                    @' ';
                    label {
                        input (type='radio', name='position', value='content',
                            data.position === 'content'? s: '');
                        @'正文';
                    }
                }
            }
        }
        if (req.blogs) {
            div#articlelist.panel {
                div.panel_title {
                    @'搜索结果';
                }
                div.panel_content {
                    form#sort_form (action='/search' + uidQuery, method='post') {
                        input (type='hidden', name='query', value=data.query);
                        input (type='hidden', name='position', value=data.position);
                        input (type='hidden', name='whole_site', value=data.wholeSite);
                        input (type='hidden', name='sort', value=data.sort);
                        div {
                            @sortOption(data, '最多阅读', 'most_read');
                            @' ';
                            @sortOption(data, '最少阅读', 'least_read');
                            @' ';
                            @sortOption(data, '最新', 'latest');
                            @' ';
                            @sortOption(data, '最旧', 'oldest');
                        }
                    }
                    for (var i = 0; i<req.blogs.length; i++) {
                        div.blog {
                            @view.render("blogSummary", req, req.blogs[i],
                                data.wholeSite? 2: 0);
                        }
                    }
                    @lib.pagination(req.blogsPaging);
                }
            }
        }
    };
    
    return view.render("layout", req, {
        omitHeader: true,
        nav: 2,
        title: "搜索",
        body: body
    });
};