$(function () {
    $(".modify_panel").map(function (i, panel) {
        $(".modify", panel).click(function (event) {
            var type = this.dataset.type;
            document.body.className = type + " visible";
            location.replace("#" + type);
            event.preventDefault();
        });
        
        $(".cancel", panel).click(function (event) {
            document.body.className = "";
            location.replace("#");
            event.preventDefault();
            $(".alert", panel)[0].textContent = "";
        });
    });
    
    var iconForm = document.forms.modify_icon_form,
        icon = iconForm.icon,
        iconAlert = $(".alert", iconForm)[0];
    
    $(modify_icon_form).submit(function (event) {
        if (icon.value === "") {
            err("请选择头像", icon, event, iconAlert);
        }
    }).find(".cancel").click(function () {
        icon.value = "";
    });
    
    var nicknameForm = document.forms.modify_nickname_form,
        nickname = nicknameForm.nickname,
        nicknameAlert = $(".alert", nicknameForm)[0],
        originalNickname = nickname.value;
    
    $(modify_nickname_form).submit(function (event) {
        if (!validateNotEmpty("昵称", nickname, event, nicknameAlert) &&
            nickname.value === originalNickname) {
            event.preventDefault();
            $(".modify_panel", nicknameForm)[0].className = "modify_panel";
        }
    }).find(".cancel").click(function () {
        nickname.value = originalNickname;
    });
    
    var passwordForm = document.forms.modify_password_form,
        oldPassword = passwordForm.old_password,
        password = passwordForm.password,
        confirm = passwordForm.confirm_password,
        passwordAlert = $(".alert", passwordForm)[0];
    
    $(passwordForm).submit(function (event) {
        if (oldPassword.value === "") {
            err("请输入旧密码", oldPassword, event, passwordAlert);
        } else if (password.value === oldPassword.value) {
            err("新密码不能与旧密码相同", password, event, passwordAlert);
        } else {
            validateNewPassword(password, confirm, event, passwordAlert);
        }
    }).find(".cancel").click(function () {
        oldPassword.value = "";
        password.value = "";
        confirm.value = "";
    });
    
    var hash = location.hash;
    if (hash === "#icon" ||
        hash === "#nickname" ||
        hash === "#password" ||
        hash === "#description") {
        document.body.className = hash.substr(1) + " visible";
    }
});