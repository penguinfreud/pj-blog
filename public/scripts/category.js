document.getElementById("rename_category").addEventListener("click", function (event) {
    event.preventDefault();
    var newName = prompt("将" + categoryName + "重命名为");
    if (newName === "") {
        alert("分类名不能为空");
    } else {
        $.post("/rename_category", {
            id: categoryId,
            name: newName
        }, function () {
            location.reload();
        });
    }
}, false);