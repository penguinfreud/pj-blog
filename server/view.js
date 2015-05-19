var sweet = require("sweet.js"),
fs = require("fs"),
Module = require("module"),
pathModule = require("path");

var viewDir = pathModule.normalize(__dirname + "/../views/");

var viewRequire = exports.require = function (str) {
    var input = viewDir + str + ".sjs",
        output = viewDir + str + ".js",
        stat1, stat2;
    try {
        stat1 = fs.statSync(input);
        stat2 = fs.statSync(output);
        if (stat1.mtime > stat2.mtime) {
            delete Module._cache[output];
            viewCompile(input, output);
        }
    } catch (e) {
        if (!stat1) {
            throw new Error("view not found: " + str);
        } else if (!stat2) {
            viewCompile(input, output);
        }
    }
    return require(output);
};

var _macroLoaded = false;

var viewCompile = function (input, output) {
    if (!_macroLoaded) {
        sweet.loadMacro("./server/macro");
        _macroLoaded = true;
    }
    console.log("compiling " + input);
    var source = fs.readFileSync(input).toString("UTF-8");
    try {
        var result = sweet.compile(source);
        fs.writeFileSync(output, result.code);
    } catch (e) {
        console.error(e.stack);
    }
};

var slice = Array.prototype.slice;
exports.render = function (view) {
    return viewRequire(view).run.apply(null, slice.call(arguments, 1));
};