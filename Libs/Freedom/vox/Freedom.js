///// <reference path="../global/ChainError.ts"/>
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var ArrayUtil = (function () {
            function ArrayUtil() {
            }
            /**
             * 简单数组乱序
             * @param a array
             */
            ArrayUtil.shuffle = function (a) {
                var len = a.length;
                for (var i = 1; i < len; i++) {
                    var end = len - i;
                    var index = (Math.random() * (end + 1)) >> 0;
                    var t = a[end];
                    a[end] = a[index];
                    a[index] = t;
                }
                return a;
            };
            /**
             * 从数组指定范围内随机取出指定数量的不重复元素
             * <listing version="3.0">
             * ArrayUtils.randomize([0,1,2,3,4,5,6,7,8,9], 3, 2, 7);
             * //返回[6,2,3]
             * </listing>
             * @param arr 		原始数组
             * @param count	    数量，默认为范围内全部元素
             * @param begin 	起始位置，默认为0
             * @param end		结束位置，默认为数组长度
             */
            ArrayUtil.randomize = function (arr, count, begin, end) {
                if (!arr || begin < 0)
                    arr = arr.concat();
                var len = arr.length;
                end = end >> 0;
                if (!(end >= 0 && end <= len)) {
                    end = len;
                }
                begin = begin >> 0;
                if (!(begin > 0)) {
                    begin = 0;
                }
                count = count >> 0;
                if (!(count >= 0 && count < end - begin)) {
                    count = end - begin;
                }
                var arr2 = [];
                var end2 = begin + count;
                for (var i = begin; i < end2; i++) {
                    var index = (Math.random() * (end - i) + i) >> 0;
                    arr2[i - begin] = arr[index];
                    arr[index] = arr[i];
                }
                return arr2;
            };
            return ArrayUtil;
        })();
        utils.ArrayUtil = ArrayUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var DateUtil = (function () {
            function DateUtil() {
            }
            /**
             * 格式化日期和时间
             * @param format        格式，如"yyyy-MM-dd-hh-mm-ss"
             */
            DateUtil.getFormattedDate = function (format) {
                var tempDate = new Date();
                var o = {
                    "M+": tempDate.getMonth() + 1,
                    "d+": tempDate.getDate(),
                    "h+": tempDate.getHours(),
                    "m+": tempDate.getMinutes(),
                    "s+": tempDate.getSeconds(),
                    "q+": Math.floor((tempDate.getMonth() + 3) / 3),
                    "S": tempDate.getMilliseconds() //millisecond
                };
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (tempDate.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                            ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            };
            ;
            return DateUtil;
        })();
        utils.DateUtil = DateUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var EnumUtil = (function () {
            function EnumUtil() {
            }
            EnumUtil.getKeys = function (enm) {
                var keys = [];
                for (var key in enm) {
                    if (!$.isNumeric(key)) {
                        keys.push(key);
                    }
                }
                return keys;
            };
            return EnumUtil;
        })();
        utils.EnumUtil = EnumUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var EventUtil = (function () {
            function EventUtil() {
            }
            EventUtil.dispatchEvent = function (target, type) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                $(target).trigger(type, args);
            };
            EventUtil.addEventListener = function (target, type, handler) {
                if (target != null && type != null && type != "") {
                    $(target).on(type, handler);
                }
            };
            EventUtil.removeEventHandler = function (target, type, handler) {
                if (target != null && type != null && type != "") {
                    $(target).off(type, handler);
                }
            };
            return EventUtil;
        })();
        utils.EventUtil = EventUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var HtmlUtil = (function () {
            function HtmlUtil() {
            }
            HtmlUtil.clearChildren = function (node) {
                for (var i = 0, len = node.childElementCount; i < len; i++) {
                    node.removeChild(node.firstChild);
                }
            };
            return HtmlUtil;
        })();
        utils.HtmlUtil = HtmlUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
//# sourceMappingURL=Freedom.js.map