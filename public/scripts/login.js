$(function () {
    var loginForm = document.forms.login_form,
        signupForm = document.forms.signup_form,
        loginUsername = loginForm.username,
        loginPassword = loginForm.password,
        signupUsername = signupForm.username,
        signupNickname = signupForm.nickname,
        signupPassword = signupForm.password,
        signupConfirm = signupForm.confirm_password,
        alert = $("div.alert")[0];
    
    var toggle = $("#toggle").click(function () {
        if (document.body.className === "") {
            document.body.className = "signup";
            this.textContent = "登录";
            document.title = "注册";
            location.replace("#signup");
        } else {
            document.body.className = "";
            this.textContent = "注册";
            document.title = "登录";
            location.replace("#");
        }
    })[0];
    
    if (location.hash === "#signup") {
        document.body.className = "signup";
        toggle.textContent = "登录";
        document.title = "注册";
    }
    
    $(".cancel", loginForm).click(function () {
        loginUsername.value = "";
        loginPassword.value = "";
    });
    
    $(".cancel", signupForm).click(function () {
        signupUsername.value = "";
        signupNickname.value = "";
        signupPassword.value = "";
        signupConfirm.value = "";
    });
    
    var err = function (msg, control, event) {
        alert.textContent = msg;
        control.focus();
        event.preventDefault();
    };
    
    var save = function () {
        setCookie("lun", loginUsername.value);
        setCookie("sun", signupUsername.value);
        setCookie("snn", signupNickname.value);
    };
    
    $(loginForm).submit(function (event) {
        save();
        if (loginUsername.value === "") {
            err("用户名不能为空", loginUsername, event);
        } else if (loginPassword.value === "") {
            err("密码不能为空", loginPassword, event);
        }
    });
    
    $(signupForm).submit(function (event) {
        save();
        var username = signupUsername.value,
            password = signupPassword.value;
        if (username === "") {
            err("用户名不能为空", signupUsername, event);
        } else if (username.length < 2) {
            err("用户名太短", signupUsername, event);
        } else if (username.length > 14) {
            err("用户名太长", signupUsername, event);
        } else if (/[^A-Za-z0-9_]/.test(username)) {
            err("用户名只能包含英文字母、数字、下划线", signupUsername, event);
        } else if (password === "") {
            err("密码不能为空", signupPassword, event);
        } else if (password.length < 6) {
            err("密码太短", signupPassword, event);
        } else if (username.length > 25) {
            err("密码太长", signupPassword, event);
        } else if (/[^\x20-\x7e]/.test(password)) {
            err("密码含有非法字符", signupPassword, event);
        } else if (/^[0-9]+$/.test(password)) {
            err("密码不能只包含数字", signupPassword, event);
        } else if (signupConfirm.value !== password) {
            err("重复密码不一致", signupConfirm, event);
        }
    });
    
    $(window).on("beforeunload", save);
    
    loginUsername.value = getCookie("lun") || "";
    signupUsername.value = getCookie("sun") || "";
    signupNickname.value = getCookie("snn") || "";
});