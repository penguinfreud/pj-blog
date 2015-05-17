var getCookie = function (key) {
    var cookie = document.cookie;
    var i = cookie.indexOf(key + "=");
    if (i >= 0) {
        var j = cookie.indexOf(";", i);
        return cookie.substring(i + key.length + 1, j === -1? cookie.length: j);
    }
};

var setCookie = function (key, value) {
    document.cookie = key + "=" + encodeURIComponent(value);
};

var deleteCookie = function (key) {
    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
};
