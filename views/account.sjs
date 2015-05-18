var view = require("../server/view"),
    lib = view.require("lib");

exports.run = View(req) {
    var user = req.session.user;
    html {
        head {
            @lib.title(user.username + ' 的账户');
            @lib.style('/css/ui.css');
            @lib.style('/css/account.css');
            @lib.script('/scripts/jquery-2.1.4.min.js');
            @lib.script('/scripts/validate.js');
            @lib.script('/scripts/account.js');
        }
        body {
            @lib.toolbar(req);
            div#body {
                div {
                    @user.username;
                    @' 的账户';
                }
                div.hr {}
                div.alert {}
                div.field.icon {
                    
                    form#modify_icon_form (action='/modify_icon', method='POST', enctype='multipart/form-data') {
                        span.modify_panel {
                            span {
                                @'选择头像：';
                                input (type='file', name='icon', accept='image/jpg, image/jpeg, image/gif, image/png, image/bmp');
                                @' ';
                                input.button.ok (type='submit', value='确认');
                                a.button.cancel (href='#') {
                                    @'取消';
                                }
                            }
                            span.toggle {
                                img (src='/icons/'+user.icon, alt=user.nickname, title=user.nickname);
                                br;
                                a.modify (href='#', 'data-type'='icon') {
                                    @'修改头像';
                                }
                            }
                        }
                    }
                }
                div.field.nickname {
                    @'昵称：';
                    form#modify_nickname_form (action='/modify_nickname', method='POST') {
                        span.modify_panel {
                            span {
                                input (type='text', name='nickname', value=user.nickname);
                                @' ';
                                input.button.ok (type='submit', value='确认');
                                a.button.cancel (href='#') {
                                    @'取消';
                                }
                            }
                            span.toggle {
                                @user.nickname;
                                @' ';
                                a.modify (href='#', 'data-type'='nickname') {
                                    @'修改';
                                }
                            }
                        }
                    }
                }
                div.field.password {
                    form#modify_password_form (action='/modify_password', method='POST') {
                        span.modify_panel {
                            div {
                                label {
                                    @'旧密码：';
                                }
                                input (type='password', name='old_password', maxlength='20');
                            }
                            div {
                                label {
                                    @'新密码：';
                                }
                                input (type='password', name='password', maxlength='20');
                                div.small {
                                    @'密码长度6-25位，可包含英文字母、数字、符号，不能只含数字';
                                }
                            }
                            div {
                                label {
                                    @'重复密码：';
                                }
                                input (type='password', name='confirm_password', maxlength='20');
                            }
                            div {
                                input.button.ok (type='submit', value='确认');
                                a.button.cancel (href='#') {
                                    @'取消';
                                }
                            }
                            span.toggle {
                                a.modify (href='#', 'data-type'='password') {
                                    @'修改密码';
                                }
                            }
                        }
                    }
                }
                div.field.description {
                    @'自我介绍：';
                    form#modify_desc_form (action='/modify_description', method='POST') {
                        span.modify_panel {
                            div {
                                textarea (name='description') {
                                    @lib.unprocessContent(user.description || '');
                                }
                                br;
                                input.button.ok (type='submit', value='确认');
                                a.button.cancel (href='#') {
                                    @'取消';
                                }
                            }
                            span.toggle {
                                a.modify (href='#', 'data-type'='description') {
                                    @'修改';
                                }
                                div {
                                    @user.description;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};