exports.validateSignup = function (params) {
    return exports.validateUsername(params.username) ||
        exports.validatePassword(params.password, params.confirm_password);
};

exports.validateUsername = function (username) {
    var msg;
    if (username === "") {
        msg = "用户名不能为空";
    } else if (username.length < 2) {
        msg = "用户名太短";
    } else if (username.length > 14) {
        msg = "用户名太长";
    } else if (/[^A-Za-z0-9_]/.test(username)) {
        msg = "用户名只能包含英文字母、数字、下划线";
    }
    return msg;
};

exports.validatePassword = function (password, confirm) {
    var msg;
    if (password === "") {
        msg = "密码不能为空";
    } else if (password.length < 6) {
        msg = "密码太短";
    } else if (username.length > 25) {
        msg = "密码太长";
    } else if (/[^\x20-\x7e]/.test(password)) {
        msg = "密码含有非法字符";
    } else if (/^[0-9]+$/.test(password)) {
        msg = "密码不能只包含数字";
    } else if (confirm !== password) {
        msg = "重复密码不一致";
    }
    return msg;
};
