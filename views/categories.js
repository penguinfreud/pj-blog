exports.run = function (req$912) {
    var output$913 = [];
    {
        var c$914 = req$912.categories, i$915, l$916 = c$914.length, sum$917 = 0;
        for (i$915 = 0; i$915 < l$916; i$915++) {
            sum$917 += c$914[i$915].blog_count;
        }
        c$914.unshift({
            name: '\u5168\u90E8\u535A\u6587',
            blog_count: sum$917
        });
        l$916++;
    }
    output$913.push('<', 'div', ' id="categories"', ' class="panel"', '>');
    output$913.push('<', 'div', ' class="panel_title"', '>');
    output$913.push('\u5206\u7C7B');
    output$913.push('</', 'div', '>');
    output$913.push('<', 'div', ' class="panel_content"', '>');
    output$913.push('<', 'ul', '>');
    for (i$915 = 0; i$915 < l$916; i$915++) {
        output$913.push('<', 'li', '>');
        output$913.push('<', 'a', ' href="', '/blog/' + req$912.user.id + '/category/' + c$914[i$915].id, '"', '>');
        output$913.push(c$914[i$915].name);
        output$913.push('</', 'a', '>');
        output$913.push('<', 'span', '>');
        output$913.push('(');
        output$913.push(c$914[i$915].blog_count);
        output$913.push(')');
        output$913.push('</', 'span', '>');
        output$913.push('</', 'li', '>');
    }
    output$913.push('</', 'ul', '>');
    output$913.push('</', 'div', '>');
    output$913.push('</', 'div', '>');
    return output$913.join('');
};