exports.run = View(req) {
    div.panel {
        div.panel_title {
            @'搜索文章';
        }
        div.panel_content {
            form#search_form (action='/search?uid=' + req.params.uid, method='post') {
                input#search_input (type='text', name='query');
                p {
                    label {
                        input (type='radio', name='whole_site', value='on');
                        @'全站';
                    }
                    @' ';
                    label {
                        input (type='radio', name='whole_site', value='off', checked='true');
                        @req.user.nickname; @'的博客';
                    }
                    br;
                    label {
                        input (type='radio', name='position', value='title', checked='true');
                        @'标题';
                    }
                    @' ';
                    label {
                        input (type='radio', name='position', value='content');
                        @'正文';
                    }
                }
                input.button (type='submit', value='搜索');
            }
        }
    }
};