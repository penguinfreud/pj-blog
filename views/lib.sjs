exports.script = function (src) {
    return '<script src="' + src + '"></script>';
};

exports.style = function (href) {
    return '<link rel="stylesheet" href="' + href + '" />';
};

exports.title = function (title) {
    return '<title>' + title + '</title>';
};
