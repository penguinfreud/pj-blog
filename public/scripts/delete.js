$(function () {
    $("a.del").click(function (event) {
        if (!confirm("您确定要删除" + this.dataset.obj + "吗？")) {
            event.preventDefault();
        }
    });
});