var view$946 = require('../server/view');
exports.run = function (req$947) {
    return view$946.render('layout', req$947, {
        nav: 0,
        bodyLeft: view$946.render('info', req$947) + view$946.render('categories', req$947),
        bodyRight: view$946.render('blogSummaryList', req$947)
    });
};