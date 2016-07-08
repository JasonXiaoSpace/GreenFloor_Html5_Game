var vox;
(function (vox) {
    var utils;
    (function (utils) {
        (function (LogLevel) {
            LogLevel[LogLevel["Emeg"] = 0] = "Emeg";
            LogLevel[LogLevel["Alert"] = 1] = "Alert";
            LogLevel[LogLevel["Crit"] = 2] = "Crit";
            LogLevel[LogLevel["Warning"] = 3] = "Warning";
            LogLevel[LogLevel["Notice"] = 4] = "Notice";
            LogLevel[LogLevel["Info"] = 5] = "Info";
            LogLevel[LogLevel["Debug"] = 6] = "Debug";
        })(utils.LogLevel || (utils.LogLevel = {}));
        var LogLevel = utils.LogLevel;
        server;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
var LogUtils = (function () {
    function LogUtils() {
    }
    return LogUtils;
})();
exports.LogUtils = LogUtils;
//# sourceMappingURL=LogUtils.js.map