$(function () {
    var commentForm = $("#comment_form")[0],
    content = commentForm.content,
    email = commentForm.email,
    name = commentForm.name,
    commentAlert = $(".alert", commentForm)[0];
    $(commentForm).submit(function (event) {
        if (!validateNotEmpty("评论", content, event, commentAlert)) {
            if (email && name) {
                if (!validateNotEmpty("邮箱", email, event, commentAlert) &&
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+$/i.test(email)) {
                    err("邮箱格式不正确", email, event, commentAlert);
                } else {
                    validateNotEmpty("昵称", name, event, commentAlert);
                }
            }
        }
    });
});