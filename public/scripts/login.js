$(function () {
    var loginForm = document.forms.login_form,
        signupForm = document.forms.signup_form,
        loginUsername = loginForm.username,
        loginPassword = loginForm.password,
        signupUsername = signupForm.username,
        signupNickname = signupForm.nickname,
        signupPassword = signupForm.password,
        signupConfirm = signupForm.confirm_password;
    
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
    
    var save = function () {
        setCookie("lun", loginUsername.value);
        setCookie("sun", signupUsername.value);
        setCookie("snn", signupNickname.value);
    };
    
    $(loginForm).submit(function (event) {
        save();
        validateNotEmpty("用户名", loginUsername, event) ||
            validateNotEmpty("密码", loginPassword, event);
    });
    
    $(signupForm).submit(function (event) {
        save();
        validateNewUsername(signupUsername, event) ||
            validateNotEmpty("昵称", signupNickname, event) ||
            validateNewPassword(signupPassword, signupConfirm, event);
    });
    
    $(window).on("beforeunload", save);
    
    loginUsername.value = getCookie("lun") || "";
    signupUsername.value = getCookie("sun") || "";
    signupNickname.value = getCookie("snn") || "";
});