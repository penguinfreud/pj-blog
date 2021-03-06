var view = require("../server/view"),
    lib = view.require("lib");

exports.run = View(msg, isSignup) {
    html {
        head {
            @lib.title('登录');
            @lib.style('/css/login.css');
            @lib.style('/css/ui.css');
            @lib.jquery({});
            @lib.script('/scripts/cookie.js');
            @lib.script('/scripts/validate.js');
            @lib.script('/scripts/login.js');
        }
        body {
            div#logo_wrapper {
                div {
                    a#toggle.align_right.f (href='#', onclick='return false;') {
                        @'注册';
                    }
                }
                div#logo {}
            }
            div#input_container {
                form#login_form (action='#', method='POST') {
                    input (type='hidden', name='type', value='login');
                    div {
                        @'请输入您的帐号及密码';
                    }
                    div.alert {
                        if (msg && !isSignup) {
                            @msg;
                        }
                    }
                    div.inputs {
                        div {
                            label {
                                @'用户名：';
                            }
                            input (type='text', name='username', maxlength='20');
                        }
                        div {
                            label {
                                @'密码：';
                            }
                            input (type='password', name='password', maxlength='20');
                        }
                    }
                    div.buttons {
                        input.button (type="submit", value="登录");
                        button.button.cancel {
                            @'取消';
                        }
                    }
                }
                form#signup_form (action='#signup', method='POST') {
                    input (type='hidden', name='type', value='signup');
                    div {
                        @'注册新用户';
                    }
                    div.alert {
                        if (msg && isSignup) {
                            @msg;
                        }
                    }
                    div.inputs {
                        div {
                            label {
                                @'用户名：';
                            }
                            input (type='text', name='username', maxlength='20');
                            div.small {
                                @'用户名只能包含英文字母、数字、下划线，长度2-14位';
                            }
                        }
                        div {
                            label {
                                @'昵称：';
                            }
                            input (type='text', name='nickname', maxlength='20');
                        }
                        div {
                            label {
                                @'密码：';
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
                    }
                    div.buttons {
                        input.button (type="submit", value="注册");
                        button.button.cancel {
                            @'取消';
                        }
                    }
                }
            }
        }
    }
};