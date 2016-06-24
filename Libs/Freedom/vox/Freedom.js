var vox;
(function (vox) {
    var commond;
    (function (commond) {
        var BaseCommand = (function () {
            function BaseCommand() {
            }
            return BaseCommand;
        })();
        commond.BaseCommand = BaseCommand;
    })(commond = vox.commond || (vox.commond = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var context;
    (function (context) {
        var ApplicationContext = (function () {
            function ApplicationContext() {
                this.initingRequestsComplete = false;
            }
            return ApplicationContext;
        })();
        context.ApplicationContext = ApplicationContext;
    })(context = vox.context || (vox.context = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var enums;
    (function (enums) {
        var ErrorCode = (function () {
            function ErrorCode() {
            }
            ErrorCode.UNCAUGHT_ERROR = "50000";
            ErrorCode.HTTP_REQUEST_ERROR = "50001";
            ErrorCode.HTTP_REQUEST_TIMEOUT = "50002";
            ErrorCode.JSON_STRINGIFY_ERROR = "50003";
            ErrorCode.JSON_PARSE_ERROR = "50004";
            ErrorCode.COOKIE_INVALID = "50005";
            ErrorCode.LOAD_IMAGE_ERROR = "50006";
            ErrorCode.LOAD_AUDIO_ERROR = "50007";
            ErrorCode.UPLOAD_ERROR = "50008";
            ErrorCode.UPLOAD_TIMEOUT = "50009";
            ErrorCode.INIT_PARAMS_NO_DOMAIN = "50100";
            ErrorCode.INIT_PARAMS_NO_IMG_DOMAIN = "50101";
            ErrorCode.INIT_PARAMS_NO_HW_PRACTICE_URL = "50102";
            ErrorCode.GET_FLASHVARS_ERROR = "50110";
            ErrorCode.ALTERNATE_CDN_ERROR = "50111";
            ErrorCode.EXAM_PARAMS_ERROR = "51000";
            ErrorCode.EXAM_GET_PAPER_ERROR = "51001";
            ErrorCode.EXAM_GET_QUESTION_ERROR = "51002";
            ErrorCode.EXAM_GET_ANSWER_ERROR = "51003";
            ErrorCode.EXAM_SUBMIT_ERROR = "51004";
            ErrorCode.EXAM_GET_QUESTION_MISSING = "51005";
            ErrorCode.EXAM_SUB_QUESTION_DATA_ERROR = "51006";
            ErrorCode.EXAM_QUESTION_DATA_ERROR = "51007";
            ErrorCode.EXAM_SUPER_QUESTION_DATA_ERROR = "51008";
            ErrorCode.LOAD_HTML_TPL_ERROR = "51010";
            ErrorCode.FIND_HTML_TPL_FAIL = "51011";
            ErrorCode.HOMEWORK_GET_QUESTION_ERROR = "52001";
            ErrorCode.HOMEWORK_NO_VALID_QUESTION = "52002";
            ErrorCode.HOMEWORK_SUBMIT_ERROR = "52003";
            ErrorCode.HOMEWORK_GET_RESULT_ERROR = "52004";
            ErrorCode.HOMEWORK_GET_PRACTICE_DETAIL_ERROR = "52008";
            ErrorCode.HOMEWORK_INVALID_PRACTICE_DATA = "52009";
            ErrorCode.HOMEWORK_GET_PRACTICE_LIST_ERROR = "52010";
            ErrorCode.HOMEWORK_INVALID_PRACTICE_LIST_DATA = "52011";
            ErrorCode.HOMEWORK_INVALID_INIT_PARAMS = "52012";
            ErrorCode.HOMEWORK_INVALID_INIT_PARAMS_PRACTICE_LIST = "52013";
            return ErrorCode;
        })();
        enums.ErrorCode = ErrorCode;
    })(enums = vox.enums || (vox.enums = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var enums;
    (function (enums) {
        (function (ExplorerType) {
            ExplorerType[ExplorerType["IE"] = 0] = "IE";
            ExplorerType[ExplorerType["Edge"] = 1] = "Edge";
            ExplorerType[ExplorerType["Opera"] = 2] = "Opera";
            ExplorerType[ExplorerType["Firefox"] = 3] = "Firefox";
            ExplorerType[ExplorerType["Safari"] = 4] = "Safari";
            ExplorerType[ExplorerType["Chrome"] = 5] = "Chrome";
            ExplorerType[ExplorerType["Others"] = 6] = "Others";
        })(enums.ExplorerType || (enums.ExplorerType = {}));
        var ExplorerType = enums.ExplorerType;
    })(enums = vox.enums || (vox.enums = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var enums;
    (function (enums) {
        (function (Platform) {
            Platform[Platform["PC"] = 0] = "PC";
            Platform[Platform["IOS"] = 1] = "IOS";
            Platform[Platform["Android"] = 2] = "Android";
        })(enums.Platform || (enums.Platform = {}));
        var Platform = enums.Platform;
    })(enums = vox.enums || (vox.enums = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var events;
    (function (events) {
        var BaseEvent = (function () {
            function BaseEvent(type, eventInitDict) {
                this.type = type;
                if (eventInitDict != null) {
                    this.bubbles = eventInitDict.bubbles;
                    this.cancelable = eventInitDict.cancelable;
                }
            }
            BaseEvent.prototype.initEvent = function (eventTypeArg, canBubbleArg, cancelableArg) {
                this.type = eventTypeArg;
                this.cancelBubble = canBubbleArg;
                this.cancelable = cancelableArg;
            };
            BaseEvent.prototype.preventDefault = function () {
            };
            BaseEvent.prototype.stopImmediatePropagation = function () {
            };
            BaseEvent.prototype.stopPropagation = function () {
            };
            return BaseEvent;
        })();
        events.BaseEvent = BaseEvent;
    })(events = vox.events || (vox.events = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var net;
    (function (net) {
        var BaseMessageType = (function () {
            function BaseMessageType() {
                this.errorCode = 0;
                this.info = "";
                this._canceled = false;
            }
            BaseMessageType.prototype.getRawData = function () {
                return this._rawData;
            };
            BaseMessageType.prototype.getCanceled = function () {
                return this._canceled;
            };
            BaseMessageType.prototype.pack = function () {
                return null;
            };
            BaseMessageType.prototype.parse = function (data) {
                this._rawData = data;
                if (this._rawData.hasOwnProperty("errorCode")) {
                    this.errorCode = Number(this._rawData['errorCode']);
                }
                if (this._rawData.hasOwnProperty("info")) {
                    this.errorCode = Number(this._rawData['info']);
                }
                return this;
            };
            return BaseMessageType;
        })();
        net.BaseMessageType = BaseMessageType;
    })(net = vox.net || (vox.net = {}));
})(vox || (vox = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vox;
(function (vox) {
    var net;
    (function (net) {
        var BaseEvent = vox.events.BaseEvent;
        var BaseRequestMessage = (function (_super) {
            __extends(BaseRequestMessage, _super);
            function BaseRequestMessage(type) {
                _super.call(this, type, { bubbles: false, cancelable: false });
                this.__reloadTimes = 2;
                this.__data = null;
                this.__userData = {};
            }
            BaseRequestMessage.prototype.__url = function () {
                return null;
            };
            BaseRequestMessage.prototype.__useGet = function () {
                return false;
            };
            return BaseRequestMessage;
        })(BaseEvent);
        net.BaseRequestMessage = BaseRequestMessage;
    })(net = vox.net || (vox.net = {}));
})(vox || (vox = {}));
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
/// <reference path="../utils/LogUtil.ts"/>
/// <reference path="../utils/URLUtil.ts"/>
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var HtmlUtil = (function () {
            function HtmlUtil() {
            }
            /**
             * 清理节点的所有子节点
             * @param node 要清理的节点
             */
            HtmlUtil.clearChildren = function (node) {
                for (var i = 0, len = node.childElementCount; i < len; i++) {
                    node.removeChild(node.firstChild);
                }
            };
            /**
             * 获取指定js的基础路径
             * 如，"http://a/b/c.min.js"，返回"http://a/b/"
             * @param name      js文件名（如"examcore"）
             */
            HtmlUtil.getJsPath = function (name) {
                var re = new RegExp(name + "(-[0-9a-f]{10})?(\\.min)?\\.js(.*?)$", "i");
                var scripts = $("script");
                for (var i = 0, len = scripts.length; i < len; i++) {
                    var path = $(scripts[i]).attr('src');
                    if (re.test(path)) {
                        path = vox.utils.URLUtil.trimURL(path);
                        path = path.substr(0, path.lastIndexOf("/") + 1);
                        return path;
                    }
                }
                return null;
            };
            ;
            /**
             * 加载模板
             * @param tplList
             * @param onSuccess
             * @param onError
             */
            HtmlUtil.loadTpl = function (tplList, onSuccess, onError) {
                if (!tplList) {
                    if (onError)
                        onError(null);
                    return;
                }
                var $head = $("head");
                var htmlList = [];
                tplList.forEach(function (tpl) {
                    if (!tpl)
                        return;
                    if ($.isArray(tpl)) {
                        htmlList = htmlList.concat(tpl);
                    }
                    else {
                        $head.append(String(tpl));
                    }
                });
                next();
                function next() {
                    if (!htmlList.length) {
                        if (onSuccess)
                            onSuccess();
                        return;
                    }
                    var htmlName = htmlList[htmlList.length - 1];
                    vox.utils.LogUtil.log("【本地加载tpl.html】： " + htmlName);
                    $.get(htmlName)
                        .then(function doneCallback(data, textStatus, jqXHR) {
                        $head.append(data);
                        htmlList.length = htmlList.length - 1;
                        next();
                    }, function failCallback(jqXHR, textStatus, errorThrown) {
                        vox.utils.LogUtil.log("html模板加载失败：" + htmlName, vox.utils.LogLevel.ERR);
                        if (onError)
                            onError(htmlName);
                    });
                }
            };
            return HtmlUtil;
        })();
        utils.HtmlUtil = HtmlUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var JSONUtil = (function () {
            function JSONUtil() {
            }
            /**
             * json replacer，会将number转成string
             * @param k
             * @param v
             */
            JSONUtil.replacer = function (k, v) {
                // 不是数字的直接返回
                if (typeof v !== "number")
                    return v;
                // 是非数字的直接返回
                if (isNaN(v))
                    return v;
                // 不能转换为有限数字的直接返回
                if (!isFinite(v))
                    return v;
                // 是数字，长度小于10位，且不是浮点数的，直接返回
                var str = v.toString();
                if (str.length < 10 && str.indexOf(".") < 0)
                    return v;
                // 要返回字符串形式
                return str;
            };
            /**
             * 将obj转换为JSON字符串，会将不合法的number变为字符串
             * @param args 参数列表
             * @returns {string} 字符串
             */
            JSONUtil.stringify = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (args[1] == null)
                    args[1] = JSONUtil.replacer;
                return JSON.stringify.apply(null, args);
            };
            return JSONUtil;
        })();
        utils.JSONUtil = JSONUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
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
        var LogUtils = (function () {
            function LogUtils() {
            }
            return LogUtils;
        })();
        utils.LogUtils = LogUtils;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
/**
 * Created by Raykid on 2016/4/21.
 */
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var MaskUtil = (function () {
            function MaskUtil() {
            }
            MaskUtil.initialize = function (entity) {
                this._entity = entity;
            };
            MaskUtil.showLoading = function () {
                if (MaskUtil._entity != null)
                    MaskUtil._entity.showLoading();
            };
            MaskUtil.hideLoading = function () {
                if (MaskUtil._entity != null)
                    MaskUtil._entity.hideLoading();
            };
            MaskUtil.isShowingLoading = function () {
                if (MaskUtil._entity != null)
                    return MaskUtil._entity.isShowingLoading();
                return false;
            };
            return MaskUtil;
        })();
        utils.MaskUtil = MaskUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
/**
 * Created by Raykid on 2016/5/19.
 */
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var NumberUtil = (function () {
            function NumberUtil() {
            }
            /**
             * 将数字转换为指定长度的字符串，整数部分不足指定长度的在前面用0填充
             * @param num 要转换的数字
             * @param length 整数部分长度
             */
            NumberUtil.toLengthString = function (num, length) {
                var numStr = num.toString();
                var index = numStr.indexOf(".");
                if (index < 0)
                    index = numStr.length;
                var int = numStr.substr(0, index);
                var frac = numStr.substr(index);
                for (var i = int.length; i < length; i++) {
                    int = "0" + int;
                }
                return (int + frac);
            };
            return NumberUtil;
        })();
        utils.NumberUtil = NumberUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var ObjectUtil = (function () {
            function ObjectUtil() {
            }
            /**
             * 不是深复制，只复制了一层
             * populate properties
             * @param target        目标obj
             * @param sources       来源obj
             */
            ObjectUtil.extendObject = function (target) {
                var sources = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    sources[_i - 1] = arguments[_i];
                }
                sources.forEach(function (source) {
                    if (!source)
                        return;
                    for (var propName in source) {
                        if (source.hasOwnProperty(propName)) {
                            target[propName] = source[propName];
                        }
                    }
                });
                return target;
            };
            /**
             * 生成一个随机ID
             */
            ObjectUtil.getGUID = function () {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((parseInt(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
                return s.join("");
            };
            /**
             * 生成自增id（从0开始）
             * @param type
             */
            ObjectUtil.getAutoIncId = function (type) {
                var callee = ObjectUtil.getAutoIncId;
                var index = ObjectUtil._getAutoIncIdMap[type] || 0;
                ObjectUtil._getAutoIncIdMap[type] = index++;
                return type + "-" + index;
            };
            ;
            ObjectUtil._getAutoIncIdMap = {};
            return ObjectUtil;
        })();
        utils.ObjectUtil = ObjectUtil;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
//# sourceMappingURL=Freedom.js.map