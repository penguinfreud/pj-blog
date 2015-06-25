$(function () {
    var like = function (event) {
        var anchor = this, isLike = this.className === "like";
        $.get((isLike? "/like/": "/cancel_like/") + anchor.dataset.blogid, function () {
            var inc;
            if (isLike) {
                anchor.className = "cancel_like";
                anchor.textContent = "已赞";
                inc = 1;
            } else {
                anchor.className = "like";
                anchor.textContent = "赞";
                inc = -1;
            }
            var s = anchor.nextSibling.nodeValue;
            var count = parseInt(s.substring(1, s.length - 1));
            anchor.nextSibling.nodeValue = "(" + (count + inc) + ")";
        });
        event.preventDefault();
    };
    var elems = $("a.like, a.cancel_like"), i;
    for (i = 0; i<elems.length; i++) {
        elems[i].addEventListener("click", like, false);
    }
});