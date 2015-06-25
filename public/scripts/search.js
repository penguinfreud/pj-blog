$(function () {
    var sortForm = document.forms.sort_form, sort;
    
    if (sortForm) {
        sort = sortForm.sort;
        $(".sort_option").click(function () {
            sort.value = this.dataset.val;
            sortForm.submit();
        });
    }
});