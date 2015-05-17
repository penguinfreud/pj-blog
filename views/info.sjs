exports.run = View(req) {
    div#info.panel {
        div.panel_title {
            @'个人资料';
        }
        div.panel_content {
            div.info_img {
                img (src='/icons/'+req.user.icon, alt=req.user.nickname, title=req.user.nickname);
            }
            div.info_name {
                @req.user.nickname;
            }
            div.hr {}
            div.info_intro {
                @req.user.description;
            }
        }
    }
};
