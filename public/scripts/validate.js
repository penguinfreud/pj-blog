var err;

var validateNotEmpty = function (name, control, event, alertBox) {
    if (control.value === "") {
        err(name + "不能为空", control, event, alertBox);
        return 1;
    }
    return 0;
};

var validateNewUsername = function (username, event, alertBox) {
    var val = username.value;
    if (val === "") {
        err("用户名不能为空", username, event, alertBox);
    } else if (val.length < 2) {
        err("用户名太短", username, event, alertBox);
    } else if (val.length > 14) {
        err("用户名太长", username, event, alertBox);
    } else if (/[^A-Za-z0-9_]/.test(val)) {
        err("用户名只能包含英文字母、数字、下划线", username, event, alertBox);
    } else {
        return 0;
    }
    return 1;
};

var validateNewPassword = function (password, confirm, event, alertBox) {
    var val = password.value;
    if (val === "") {
        err("密码不能为空", password, event, alertBox);
    } else if (val.length < 6) {
        err("密码太短", password, event, alertBox);
    } else if (val.length > 25) {
        err("密码太长", password, event, alertBox);
    } else if (/[^\x20-\x7e]/.test(val)) {
        err("密码含有非法字符", password, event, alertBox);
    } else if (/^[0-9]+$/.test(val)) {
        err("密码不能只包含数字", password, event, alertBox);
    } else if (confirm.value !== val) {
        err("重复密码不一致", confirm, event, alertBox);
    } else {
        return 0;
    }
    return 1;
};

$(function () {
    err = function (msg, control, event, alertBox) {
        if (alertBox) {
            alertBox.textContent = msg;
        } else {
            alert(msg);
        }
        control.focus();
        event && event.preventDefault();
    };
});