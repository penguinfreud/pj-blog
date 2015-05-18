$(function () {
    var panel = $("#create_category_panel")[0],
        select = $('select[name="category"]'),
        title = $('input[name="title"]')[0],
        input = $("#category_input")[0];
    
    $("#create_category_btn").click(function (event) {
        panel.className = "visible";
        input.focus();
        event.preventDefault();
    });
    
    
    $("#create_category_ok").click(function (event) {
        var name = input.value;
        
        panel.className = "";
        input.value = "";
        event.preventDefault();
        
        if (name) {
            $.post("/create_category", { name: name },
            function (data) {
                if (data) {
                    var option = document.createElement("option");
                    option.value = data;
                    option.appendChild(document.createTextNode(name));
                    select.append(option);
                    option.selected = true;
                } else {
                    alert("创建分类失败");
                }
            });
        } else {
            alert("分类名不能为空");
        }
    });
    
    $("#create_category_cancel").click(function (event) {
        panel.className = "";
        input.value = "";
        event.preventDefault();
    });
    
    $("#edit_form").submit(function (event) {
        if (title.value === "") {
            if (!confirm("您确定不写标题吗？")) {
                event.preventDefault();
                title.focus();
            }
        }
    });
});