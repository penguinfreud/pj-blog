exports.run = View(req) {
    var user = req.user;
    div#info.panel {
        div.panel_title {
            @'个人资料';
        }
        div.panel_content {
            div.info_img {
                img (src='/icons/'+user.icon, alt=user.nickname, title=user.nickname);
            }
            div.info_name {
                @user.nickname;
            }
            div.hr {}
            div.info_intro {
                @user.description;
            }
        }
    }
};
