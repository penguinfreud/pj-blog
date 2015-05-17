module.exports = function (cb) {
    var count = 0, finished = 0, data = {}, called = 0;
    return function (name) {
        count++;
        return function (err, val) {
            if (err) {
                if (!called) {
                    called = 1;
                    cb(err, null);
                    cb = null;
                }
            } else {
                data[name] = val;
                if (++finished === count && !called) {
                    called = 1;
                    cb(null, data);
                    cb = null;
                }
            }
        };
    };
};