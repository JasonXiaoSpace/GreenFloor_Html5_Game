var vox;
(function (vox) {
    var command;
    (function (command) {
        var BaseCommand = (function () {
            function BaseCommand() {
            }
            BaseCommand.prototype.dispatch = function (typeOrEvent) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                args.unshift(typeOrEvent);
                this.context.dispatch.apply(this.context, args);
            };
            BaseCommand.prototype.listen = function (type, handler) {
                this.context.addListener(type, handler);
            };
            BaseCommand.prototype.unlisten = function (type, handler) {
                this.context.removeListener(type, handler);
            };
            BaseCommand.prototype.exec = function () {
            };
            return BaseCommand;
        })();
        command.BaseCommand = BaseCommand;
    })(command = vox.command || (vox.command = {}));
})(vox || (vox = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vox;
(function (vox) {
    var command;
    (function (command) {
        var ChangeModuelCommand = (function (_super) {
            __extends(ChangeModuelCommand, _super);
            function ChangeModuelCommand() {
                _super.apply(this, arguments);
            }
            ChangeModuelCommand.prototype.exec = function () {
                var module = this.parameters[0];
                if (module != null) {
                    window.location.hash = "#" + module.getName();
                }
            };
            return ChangeModuelCommand;
        })(command.BaseCommand);
        command.ChangeModuelCommand = ChangeModuelCommand;
    })(command = vox.command || (vox.command = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var command;
    (function (command) {
        var InitModuleCommand = (function (_super) {
            __extends(InitModuleCommand, _super);
            function InitModuleCommand() {
                _super.apply(this, arguments);
            }
            InitModuleCommand.prototype.exec = function () {
                if (this.context.initRequestsComplete) {
                }
            };
            return InitModuleCommand;
        })(command.BaseCommand);
        command.InitModuleCommand = InitModuleCommand;
    })(command = vox.command || (vox.command = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var command;
    (function (command) {
        var AudioManager = vox.manager.AudioManager;
        var ExternalEventManager = vox.manager.ExternalEventManager;
        var LogUtils = vox.utils.LogUtils;
        var LogLevel = vox.utils.LogLevel;
        var InitializedCommand = (function (_super) {
            __extends(InitializedCommand, _super);
            function InitializedCommand() {
                _super.apply(this, arguments);
            }
            InitializedCommand.prototype.exec = function () {
                AudioManager.initialize();
                ExternalEventManager.initialize();
                //如果没有外壳参数，则捏造一个
                if (window["external"]["getInitParams"] == null) {
                    window["external"] = {
                        getInitParam: function () {
                            return JSON.stringify({ domain: "https://www.test.17zuoye.net" });
                        },
                        payOrder: function () {
                            alert("payOrder");
                        }
                    };
                }
                //全局错误捕获
                var appName = this.context.getSystemConfig().app;
                window.onerror = function (errMsg, scriptURI, lineNumber, columnNumber, errObj) {
                    LogUtils.remoteLog({
                        _lv: LogLevel.Err,
                        module: appName,
                        op: "window.onerror",
                        msg: errMsg
                    }, {
                        errorMessage: errMsg,
                        scriptURI: scriptURI,
                        lineNumber: lineNumber,
                        columnNumber: columnNumber,
                        errorObj: errObj,
                        currentModule: ModuleManager.getCurModule().getName()
                    });
                };
            };
            return InitializedCommand;
        })(command.BaseCommand);
        command.InitializedCommand = InitializedCommand;
    })(command = vox.command || (vox.command = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var context;
    (function (context) {
        var SystemConfig = vox.system.SystemConfig;
        var ExplorerType = vox.enums.ExplorerType;
        var ExternalIOS = vox.external.ExternalIOS;
        var ExternalAndroid = vox.external.ExternalAndroid;
        var ExternalPC = vox.external.ExternalPC;
        var EnvCode = vox.system.EnvCode;
        var EventUtil = vox.utils.EventUtil;
        var ModuleManager = vox.manager.ModuleManager;
        var ContextManager = (function () {
            function ContextManager() {
            }
            /*初始化Freedom Evolve框架*/
            ContextManager.initialize = function () {
                var apps = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    apps[_i - 0] = arguments[_i];
                }
                ContextManager._apps = apps;
                for (var i in apps) {
                    ContextManager.context;
                }
            };
            /**静态获取ApplicationContext的方式*/
            ContextManager.context = new ApplicationContext();
            return ContextManager;
        })();
        context.ContextManager = ContextManager;
        var ApplicationContext = (function () {
            function ApplicationContext() {
                this.initRequestsComplete = false;
                this._singletonDict = {};
                this._responseDatas = {};
                this._applicationDict = {};
            }
            //--------------getter方法--------------
            ApplicationContext.prototype.getExternal = function () {
                return this._external;
            };
            ApplicationContext.prototype.getSystemConfig = function () {
                return this._systemConfig;
            };
            ApplicationContext.prototype.getApplication = function (type) {
                return this._applicationDict[type];
            };
            ApplicationContext.prototype.getDefaultApplcation = function () {
                return this._defaultApplication;
            };
            ApplicationContext.prototype.getInitParams = function () {
                return this._initParam;
            };
            ApplicationContext.prototype.getExplorerType = function () {
                return this._explorerType;
            };
            ApplicationContext.prototype.getExplorerVersion = function () {
                return this._explorerVersion;
            };
            ApplicationContext.prototype.getExplorerBigVersion = function () {
                return this._explorerBigVersion;
            };
            ApplicationContext.prototype.initApp = function (app) {
                //注册应用程序引用
                this._applicationDict[app.getType()] = app;
                if (this._defaultApplication == null)
                    this._defaultApplication = app;
                //注册数据模型
                var models = app.listModels();
                for (var i in models) {
                    this.mapSingleton(models[i]);
                }
                //注册模块儿
                var modules = app.listModules();
                for (var name in modules) {
                    ModuleManager.registerModule(name, modules[name]);
                }
            };
            /*注册单例对象*/
            ApplicationContext.prototype.mapSingleton = function (cls) {
                var key = cls.toString();
                if (this._singletonDict[key] == null) {
                    this._singletonDict[key] = new cls();
                }
            };
            ApplicationContext.prototype.initilize = function () {
                //初始化浏览器数据
                this.initExplorer();
                //初始化Query数据
                this.initQueryParams();
                //初始化外部数据
                this.initExternalParams();
                //初始外外壳接口
                this.initExternal();
                //初始化系统配置
                this.initSystemConfig();
                //监听GetServerResponse事件
                //TODO
            };
            /**初始化浏览器类型 版本号 大版本号 肖建军@2016-06-28*/
            ApplicationContext.prototype.initExplorer = function () {
                //取得浏览器的userAgent字符串
                var userAgent = navigator.userAgent;
                //判断浏览器类型
                var regExp;
                var result;
                if (window["ActiveObject"] !== null) {
                    this._explorerType = ExplorerType.IE;
                    //获取IE版本号
                    regExp = new RegExp("MSIE ([^ ; \\)]+);");
                    if (result === null) {
                        regExp = new RegExp("rv:([^ ; \\)]+");
                    }
                }
                else if (userAgent.indexOf("Edge") > -1) {
                    //Edge浏览器
                    this._explorerType = ExplorerType.Edge;
                    regExp = new RegExp("Edge/([^ ; \\)]+)");
                }
                else if (userAgent.indexOf("Firefox") > -1) {
                    // Firefox浏览器
                    this._explorerType = vox.enums.ExplorerType.Firefox;
                    // 获取Firefox版本号
                    regExp = new RegExp("Firefox/([^ ;\\)]+)");
                }
                else if (userAgent.indexOf("Opera") > -1) {
                    // Opera浏览器
                    this._explorerType = vox.enums.ExplorerType.Opera;
                    // 获取Opera版本号
                    regExp = new RegExp("OPR/([^ ;\\)]+)");
                }
                else if (userAgent.indexOf("Chrome") > -1) {
                    // Chrome浏览器
                    this._explorerType = vox.enums.ExplorerType.Chrome;
                    // 获取Crhome版本号
                    regExp = new RegExp("Chrome/([^ ;\\)]+)");
                }
                else if (userAgent.indexOf("Safari") > -1) {
                    // Safari浏览器
                    this._explorerType = vox.enums.ExplorerType.Safari;
                    // 获取Safari版本号
                    regExp = new RegExp("Safari/([^ ;\\)]+)");
                }
                else {
                    // 其他浏览器
                    this._explorerType = vox.enums.ExplorerType.Others;
                }
                if (regExp != null) {
                    result = regExp.exec(userAgent);
                    this._explorerVersion = result[1];
                }
                else {
                    this._explorerVersion = "0.0";
                }
                this._explorerBigVersion = this._explorerVersion.split(".")[0];
            };
            /**初始化query参数，是在href？后面的*/
            ApplicationContext.prototype.initQueryParams = function () {
                this._queryParam = {};
                var loc = window.location.href;
                var query = loc.substring(loc.search(/\?/) + 1); //拿到问号后的字符串
                var vars = query.split("&");
                for (var i = 0, len = vars.length; i < len; i++) {
                    var pair = vars[i].split("=", 2);
                    if (pair.length != 2 || !pair[0])
                        continue;
                    var key = pair[0];
                    var value = pair[1];
                    key = decodeURIComponent(key);
                    value = decodeURIComponent(value);
                    //decode twice for ios
                    key = decodeURIComponent(key);
                    value = decodeURIComponent(value);
                    this._queryParam[key] = value;
                }
            };
            /**初始化external的参数*/
            ApplicationContext.prototype.initExternalParams = function () {
                //处理 window.external
                try {
                    if (!(typeof window.external !== "Object") || !window.external) {
                        window.external = {};
                    }
                }
                catch (err) {
                    window.external = {};
                }
                this._externalParam = window.external;
            };
            ApplicationContext.prototype.initExternal = function () {
                if (/iPhone|iPad|iPod|iOS/i.test(navigator.userAgent)) {
                    this._external = new ExternalIOS();
                }
                else if (/Android/i.test(navigator.userAgent)) {
                    this._external = new ExternalAndroid();
                }
                else {
                    this._external = new ExternalPC();
                }
            };
            ApplicationContext.prototype.initSystemConfig = function () {
                this._systemConfig = new SystemConfig();
                this._initParam = this._external.getInitParam(); //从location.href 和 callExternal两个地方拿到的
                if (this._initParam.server_type != null) {
                    this._systemConfig.env = this._initParam.server_type;
                    this._systemConfig.envCode = EnvCode[this._systemConfig.env];
                }
                /**提供可能的env2domain的转换表，不提供则会使用initParams中的domain*/
                var domainTransform = this._defaultApplication.getDomainTransform();
                if (domainTransform != null) {
                    this._systemConfig.domain = domainTransform[this._systemConfig.env];
                }
                if (this._systemConfig.domain == null && this._initParam.domain != null) {
                    this._systemConfig.domain = this._initParam.domain;
                }
                //设置主站domain
                if (this._initParam.domain != null) {
                    this._systemConfig.mainDomain = this._initParam.domain;
                }
                if (this._initParam.img_domain != null) {
                    this._systemConfig.imgDomain = this._initParam.img_domain;
                }
                if (this._initParam.native_version != null) {
                    this._systemConfig.nativeVersion = this._initParam.native_version;
                }
                if (this._initParam.client_type != null) {
                    this._systemConfig.clientType = this._initParam.client_type;
                }
                if (this._initParam.client_name != null) {
                    this._systemConfig.clientName = this._initParam.client_name;
                }
                if (this._initParam.uuid != null) {
                    this._systemConfig.uuid = this._initParam.uuid;
                }
                if (this._initParam.user_id != null) {
                    this._systemConfig.userId = this._initParam.user_id;
                }
                if (this._initParam.session_key != null) {
                    this._systemConfig.sessionKey = this._initParam.session_key;
                }
                if (this._initParam.ktwelve != null) {
                    this._systemConfig.ktwelve = this._initParam.ktwelve;
                }
                this._systemConfig.app = this._defaultApplication.getAppName();
                this._systemConfig.compileVersion = this._defaultApplication.getCompileVersion();
                this._systemConfig.htmlVersion = this._defaultApplication.getHtmlVersion();
                //如果是dev环境，则使用testInitParams替换当前配置
                if (this._systemConfig.envCode === EnvCode.dev) {
                    var testInitParams = this._defaultApplication.testInitParams(); //取testFlashvars
                    for (var key in testInitParams) {
                        if (testInitParams[key] != null) {
                            this._systemConfig[key] = testInitParams[key];
                        }
                    }
                }
            };
            ApplicationContext.prototype.addListener = function (type, handler) {
                EventUtil.addEventListener(this._dispatcher, type, handler);
            };
            ApplicationContext.prototype.removeListener = function (type, handler) {
                EventUtil.removeEventHandler(this._dispatcher, type, handler);
            };
            ApplicationContext.prototype.dispatch = function (typeOrEvent) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (typeOrEvent == null)
                    return;
                var type;
                if (typeof typeOrEvent == 'string') {
                    type = typeOrEvent;
                }
                else {
                    var evt = typeOrEvent;
                    type = evt.type;
                    args = [evt];
                }
                //生成command并执行
                var commandClasses = this._commondDict[type];
                var commandArgs = args.concat();
                for (var i in commandClasses) {
                    var commandClass = commandClasses[i];
                    if (commandClass != null) {
                        var cmd = new commandClass();
                        cmd.context = this;
                        cmd.external = this._external;
                        cmd.systemConfig = this._systemConfig;
                        cmd.type = type;
                        cmd.parameters = commandArgs;
                        cmd.exec();
                    }
                }
                //调用单例对象对应方法
                for (var i in this._singletonDict) {
                    var singleton = this._singletonDict[i];
                    var handler = singleton[type + "_handler"];
                    if ($.isFunction(handler)) {
                        handler.apply(singleton, args);
                    }
                }
                //调用中介者对应方法
                for (var i in this._mediatorList) {
                    var mediator = this._mediatorList[i];
                    var handler = mediator[type + "_handler"];
                    if ($.isFunction(handler))
                        handler.apply(mediator, args);
                }
                //调用常规派发事件方法
                //TODO 下面两行我没看懂 肖建军
                args.unshift(this._dispatcher, type);
                EventUtil.dispatchEvent.apply(null, args);
            };
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
        var AppEvent = (function () {
            function AppEvent() {
            }
            AppEvent.Evt_App_Initialized = "Evt_App_Initialized";
            AppEvent.Evt_Framework_Initialized = "Evt_Framework_Initialized";
            AppEvent.Evt_Init_Request_Completed = "Evt_Init_Request_Completed";
            AppEvent.Evt_Get_Server_Response = "Evt_Get_Server_Response";
            /**请求错误事件*/
            AppEvent.Evt_Request_ErrorEvent = "Evt_Request_ErrorEvent";
            AppEvent.Evt_PreChangeModule = "Evt_PreChangeModule";
            AppEvent.Evt_ChangeModule = "Evt_ChangeModule";
            AppEvent.Evt_StartLoadModule = "Evt_StartLoadModule";
            AppEvent.Evt_LoadModuleComplete = "Evt_LoadModuleComplete";
            AppEvent.Evt_LoadModuleFail = "Evt_LoadModuleFail";
            AppEvent.Evt_ShowPopup = "Evt_ShowPopup";
            AppEvent.Evt_ClosePopup = "Evt_ClosePopup";
            return AppEvent;
        })();
        events.AppEvent = AppEvent;
    })(events = vox.events || (vox.events = {}));
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
    var events;
    (function (events) {
        var EventUtil = vox.utils.EventUtil;
        var EventMapper = (function () {
            function EventMapper(target, type, handler) {
                this.target = target;
                this.type = type;
                this.handler = handler;
            }
            return EventMapper;
        })();
        var EventHolder = (function () {
            function EventHolder() {
                this._eventMappers = [];
            }
            EventHolder.prototype.getEventMapper = function (target, type, handler, remove) {
                if (remove === void 0) { remove = false; }
                var targetMapper = null;
                for (var i in this._eventMappers) {
                    var mapper = this._eventMappers[i];
                    if (mapper.target == target && mapper.type == type && mapper.handler == handler) {
                        targetMapper = mapper;
                        //如果需要移除，则移除
                        if (remove) {
                            this._eventMappers.splice(parseInt(i), 1);
                        }
                        break;
                    }
                }
                return targetMapper;
            };
            EventHolder.prototype.mapListener = function (target, type, handler) {
                if (target != null && type != null && type != "") {
                    //进行唯一性判断
                    var mapper = this.getEventMapper(target, type, handler);
                    if (mapper != null)
                        return;
                    //需要添加监听，先注册监听
                    EventUtil.addEventListener(target, type, handler);
                    this._eventMappers.push(new EventMapper(target, type, handler));
                }
            };
            EventHolder.prototype.unmapListener = function (target, type, handler) {
                //获取的同时移除记录
                var mapper = this.getEventMapper(target, type, handler, true);
                if (mapper == null)
                    return;
                //移除事件
                EventUtil.removeEventHandler(target, type, handler);
            };
            /**移除所有事件的监听*/
            EventHolder.prototype.unmapListeners = function () {
                for (var i = 0, len = this._eventMappers.length; i < len; i++) {
                    var mapper = this._eventMappers.shift();
                    EventUtil.removeEventHandler(mapper.target, mapper.type, mapper.handler);
                }
            };
            return EventHolder;
        })();
        events.EventHolder = EventHolder;
    })(events = vox.events || (vox.events = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var external;
    (function (external) {
        var ExternalAndroid = (function (_super) {
            __extends(ExternalAndroid, _super);
            function ExternalAndroid() {
                _super.apply(this, arguments);
            }
            ExternalAndroid.prototype.getOSType = function () {
                return external.OSType.Android;
            };
            return ExternalAndroid;
        })(external.ExternalMobile);
        external.ExternalAndroid = ExternalAndroid;
    })(external = vox.external || (vox.external = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var external;
    (function (external) {
        var ExternalIOS = (function (_super) {
            __extends(ExternalIOS, _super);
            function ExternalIOS() {
                _super.apply(this, arguments);
            }
            ExternalIOS.prototype.getOSType = function () {
                return external.OSType.IOS;
            };
            return ExternalIOS;
        })(external.ExternalMobile);
        external.ExternalIOS = ExternalIOS;
    })(external = vox.external || (vox.external = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var external;
    (function (external) {
        (function (OSType) {
            OSType[OSType["IOS"] = 0] = "IOS";
            OSType[OSType["Android"] = 1] = "Android";
            OSType[OSType["PC"] = 2] = "PC";
        })(external.OSType || (external.OSType = {}));
        var OSType = external.OSType;
    })(external = vox.external || (vox.external = {}));
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
/// <reference path="IExternal.ts"/>
/// <reference path="../utils/JSONUtil.ts"/>
var vox;
(function (vox) {
    var external;
    (function (external) {
        var LogUtils = vox.utils.LogUtils;
        /**
         * 移动端外壳基类
         */
        var ExternalMobile = (function () {
            function ExternalMobile() {
                this.mute = false;
                this._symbolExternalNotExsist = {};
            }
            ExternalMobile.prototype.getOSType = function () {
                return -1;
            };
            ExternalMobile.prototype.loadAudio = function (url) {
                this.callExternal("loadAudio", url);
            };
            ExternalMobile.prototype.playAudio = function (url) {
                this.callExternal("playAudio", url);
            };
            ExternalMobile.prototype.pauseAudio = function (url) {
                this.callExternal("pauseAudio", url);
            };
            ExternalMobile.prototype.seekAudio = function (url, time) {
                this.callExternal("seekAudio", url, time);
            };
            ExternalMobile.prototype.stopAudio = function (url) {
                this.callExternal("stopAudio", url);
            };
            ExternalMobile.prototype.innerJump = function (name) {
                this.callExternal("innerJump", JSON.stringify({ name: name }));
            };
            ExternalMobile.prototype.homeworkHTMLLoaded = function () {
                this.callExternal("homeworkHTMLLoaded");
            };
            ExternalMobile.prototype.localStorageSet = function (key, value) {
                if (window.external["localStorageSet"] != null) {
                    var sc = vox.context.ContextManager.context.getSystemConfig();
                    var env = sc.env;
                    var app = sc.app;
                    this.callExternal("localStorageSet", JSON.stringify({
                        category: env + "." + app,
                        key: key,
                        value: value
                    }));
                }
            };
            ExternalMobile.prototype.localStorageGet = function (key) {
                if (window.external["localStorageGet"] != null) {
                    var sc = vox.context.ContextManager.context.getSystemConfig();
                    var env = sc.env;
                    var app = sc.app;
                    var resultStr = this.callExternal("localStorageGet", JSON.stringify({
                        category: env + "." + app,
                        key: key
                    }));
                    var result = JSON.parse(resultStr);
                    if (result.success)
                        return result.value;
                    else
                        return null;
                }
                return null;
            };
            ExternalMobile.prototype.localStorageRemove = function (key) {
                if (window.external["localStorageRemove"] != null) {
                    var sc = vox.context.ContextManager.context.getSystemConfig();
                    var env = sc.env;
                    var app = sc.app;
                    this.callExternal("localStorageRemove", JSON.stringify({
                        category: env + "." + app,
                        key: key
                    }));
                }
            };
            ExternalMobile.prototype.localStorageClear = function () {
                if (window.external["localStorageClear"] != null) {
                    var sc = vox.context.ContextManager.context.getSystemConfig();
                    var env = sc.env;
                    var app = sc.app;
                    this.callExternal("localStorageClear", JSON.stringify({
                        category: env + "." + app
                    }));
                }
            };
            ExternalMobile.prototype.getInitParams = function (refresh) {
                if (this._initParams && !refresh) {
                    return this._initParams;
                }
                this._initParams = vox.utils.URLUtils.getQueryParams(window.location.href);
                var params = (this._initParams || {});
                var result = this.callExternal("getInitParams");
                if (result !== this._symbolExternalNotExsist) {
                    LogUtils.log("[external getInitParams] result: " + result);
                    var externalParams;
                    try {
                        externalParams = JSON.parse(result);
                    }
                    catch (err) {
                        LogUtils.log("[external getInitParams] json\u89E3\u6790\u5931\u8D25: " + err);
                        vox.manager.PopupManager.alert("\u83B7\u53D6\u521D\u59CB\u53C2\u6570\u5931\u8D25: " + err);
                    }
                    vox.utils.ObjectUtil.extendObject(params, externalParams);
                }
                this._initParams = params;
                return params;
            };
            ExternalMobile.prototype.callExternal = function (funcName) {
                var paramsList = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    paramsList[_i - 1] = arguments[_i];
                }
                // 调用外部接口
                if (typeof window.external[funcName] === "function") {
                    vox.utils.LogUtil.log("[call external] " + funcName + ", params: " + JSON.stringify(paramsList));
                    return window.external[funcName].apply(window.external, paramsList);
                }
                else {
                    vox.utils.LogUtil.log("[no external] " + funcName + ", params: " + JSON.stringify(paramsList));
                    return this._symbolExternalNotExsist;
                }
            };
            ExternalMobile.prototype.updateTitle = function (str, txtColor, bgColor) {
                this.callExternal("updateTitle", str, txtColor.toString(16), bgColor.toString(16));
            };
            ExternalMobile.prototype.redirectToLogin = function (from) {
                from = from || "";
                this.callExternal("redirectLogin", from);
            };
            ExternalMobile.prototype.getPlatform = function () {
                return -1;
            };
            ExternalMobile.prototype.pageQueueNew = function (params) {
                var temp = params;
                if (temp.initParams != null)
                    temp.initParams = vox.utils.JSONUtil.stringify(params.initParams);
                this.callExternal("pageQueueNew", JSON.stringify(temp));
            };
            ExternalMobile.prototype.pageQueueBack = function (params) {
                this.callExternal("pageQueueBack", JSON.stringify(params));
            };
            ExternalMobile.prototype.pageQueueRefresh = function (params) {
                this.callExternal("pageQueueRefresh", JSON.stringify(params));
            };
            ExternalMobile.prototype.pageQueueQuit = function (params) {
                this.callExternal("pageQueueQuit", JSON.stringify(params));
            };
            ExternalMobile.prototype.refreshData = function () {
                this.callExternal("refreshData");
            };
            ExternalMobile.prototype.showlog = function (msg) {
                // 调用外壳接口
                //this.callExternal("showlog", msg);
            };
            ExternalMobile.prototype.log_b = function (data) {
                if (data == null)
                    return;
                var dataStr = JSON.stringify(data);
                // 调用外壳接口
                this.callExternal("log_b", "", dataStr);
            };
            ExternalMobile.prototype.payOrder = function (params) {
                this.callExternal("payOrder", JSON.stringify(params));
            };
            ExternalMobile.prototype.registerCallBackFunction = function (type, name) {
                this.callExternal("registerCallBackFunction", JSON.stringify({
                    type: type,
                    name: name
                }));
            };
            ExternalMobile.prototype.unregisterCallBackFunction = function (type, name) {
                this.callExternal("unregisterCallBackFunction", JSON.stringify({
                    type: type,
                    name: name
                }));
            };
            return ExternalMobile;
        })();
        external.ExternalMobile = ExternalMobile;
    })(external = vox.external || (vox.external = {}));
})(vox || (vox = {}));
/**
 * 下面这堆代码是为了防止壳调用老接口产生大量错误而加的
 */
var vox;
(function (vox) {
    var task;
    (function (task) {
        function loadAudioProgress(url, state, currentTime, duration) {
        }
        task.loadAudioProgress = loadAudioProgress;
        function playAudioProgress(url, state, currentTime, duration) {
        }
        task.playAudioProgress = playAudioProgress;
        function stateNotification(value) {
        }
        task.stateNotification = stateNotification;
        function scoreComplete(id, data, err) {
        }
        task.scoreComplete = scoreComplete;
        function pauseHTML(isPaused) {
        }
        task.pauseHTML = pauseHTML;
        function uploadPhotoCallback() {
        }
        task.uploadPhotoCallback = uploadPhotoCallback;
        function refreshData(params) {
            // 派发刷新通知
            vox.context.ContextManager.context.dispatch("refreshData", params);
        }
        task.refreshData = refreshData;
        function uploadVoiceCallback() {
        }
        task.uploadVoiceCallback = uploadVoiceCallback;
    })(task = vox.task || (vox.task = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var external;
    (function (external) {
        var ContextManager = vox.context.ContextManager;
        var URLUtils = vox.utils.URLUtils;
        var Platform = vox.enums.Platform;
        var JSONUtil = vox.utils.JSONUtil;
        var ExternalPC = (function () {
            function ExternalPC() {
                this.mute = false;
                this._symbolExternalNotExist = {};
            }
            //---------------------------getter----------------------
            ExternalPC.prototype.getOSType = function () {
                return external.OSType.PC;
            };
            ExternalPC.prototype.loadAudio = function (url) {
                if (window.external["loadAudio"] != null) {
                    window.external["loadAudio"](url);
                }
            };
            ExternalPC.prototype.playAudio = function (url) {
                if (window.external["playAudio"] != null) {
                    window.external["playAudio"](url);
                }
            };
            ExternalPC.prototype.pauseAudio = function (url) {
                if (window.external["pauseAudio"] != null) {
                    window.external["pauseAudio"](url);
                }
            };
            ExternalPC.prototype.seekAudio = function (url) {
                if (window.external["seekAudio"] != null) {
                    window.external["seekAudio"](url);
                }
            };
            ExternalPC.prototype.stopAudio = function (url) {
                if (window.external["stopAudio"] != null) {
                    window.external["stopAudio"](url);
                }
            };
            ExternalPC.prototype.innerJump = function (name) {
                if (window.external["innerJump"] != null) {
                    window.external["innerJump"](JSON.stringify({ name: name }));
                }
            };
            ExternalPC.prototype.homeworkHTMLLoaded = function () {
                if (window.external["homeworkHTMLLoaded"] != null) {
                    window.external["homeworkHTMLLoaded"]();
                }
            };
            ExternalPC.prototype.localStorageSet = function (key, value) {
                if (window.external["localStorageSet"] != null) {
                    var systemConfig = ContextManager.context.getSystemConfig();
                    var env = systemConfig.env;
                    var app = systemConfig.app;
                    window.external["localStorageSet"](JSON.stringify({
                        category: env + "." + app,
                        key: key,
                        value: value
                    }));
                }
            };
            ExternalPC.prototype.localStorageGet = function (key) {
                var result;
                if (window.external["localStorageGet"] != null) {
                    var systemConfig = ContextManager.context.getSystemConfig();
                    var env = systemConfig.env;
                    var app = systemConfig.app;
                    var resultStr = window.external["localStorageGet"](JSON.stringify({
                        category: env + "." + app,
                        key: key
                    }));
                    var valueObj = JSON.parse(resultStr);
                    if (valueObj.success) {
                        result = valueObj.value;
                    }
                    else {
                        result = null;
                    }
                    result = null;
                }
                return null;
            };
            ExternalPC.prototype.localStorageRemove = function (key) {
                if (window.external["localStorageRemove"] != null) {
                    var cfg = ContextManager.context.getSystemConfig();
                    var env = cfg.env;
                    var app = cfg.app;
                    window.external["localStorageRemove"](JSON.stringify({
                        category: env + "." + app,
                        key: key
                    }));
                }
            };
            ExternalPC.prototype.localStorageClear = function () {
                if (window.external['localStorageClear'] != null) {
                    var cfg = ContextManager.context.getSystemConfig();
                    var env = cfg.env;
                    var app = cfg.app;
                    window.external['localStorageClear'](JSON.stringify({
                        category: env + "." + app
                    }));
                }
            };
            ExternalPC.prototype.getInitParams = function (refresh) {
                if (this._initParams && !refresh) {
                    return this._initParams;
                }
                this._initParams = URLUtils.getQueryParams(window.location.href);
                return (this._initParams || {});
            };
            ExternalPC.prototype.callExternal = function (funcName) {
                var paramsList = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    paramsList[_i - 1] = arguments[_i];
                }
                if (typeof window.external[funcName] === "function") {
                    LogUtils.log("[call external] " + funcName + ", params: " + JSON.stringify(paramsList));
                    return window.external[funcName].apply(window.external, paramsList);
                }
                else {
                    LogUtils.log("[no external] " + funcName + ", params: " + JSON.stringify(paramsList));
                    return this._symbolExternalNotExist;
                }
            };
            ExternalPC.prototype.updateTitle = function (str, txtColor, bgColor) {
                document.title = str;
            };
            ExternalPC.prototype.redirectToLogin = function (from) {
                from = from || "";
                this.callExternal("redirectLogin", from);
            };
            ExternalPC.prototype.getPlatform = function () {
                return Platform.PC;
            };
            ExternalPC.prototype.pageQueueNew = function (params) {
                if (window.external['pageQueueNew'] != null) {
                    var temp = params;
                    if (temp.initParam != null) {
                        temp.initParam = JSONUtil.stringify(params.initParam);
                    }
                    window.external['pageQueueNew'](JSON.stringify(temp));
                }
            };
            ExternalPC.prototype.pageQueueBack = function (params) {
                if (window.external["pageQueueBack"] != null) {
                    window.external["pageQueueBack"](JSON.stringify(params));
                }
            };
            ExternalPC.prototype.pageQueueRefresh = function (params) {
                if (window.external["pageQueueRefresh"] != null) {
                    window.external["pageQueueRefresh"](JSON.stringify(params));
                }
            };
            ExternalPC.prototype.pageQueueQuit = function (params) {
                if (window.external["pageQueueQuit"] != null) {
                    window.external["pageQueueQuit"](JSON.stringify(params));
                }
            };
            ExternalPC.prototype.refreshData = function () {
                if (window.external["refreshData"] != null) {
                    window.external["refreshData"]();
                }
            };
            ExternalPC.prototype.showlog = function (msg) {
            };
            ExternalPC.prototype.log_b = function (data) {
            };
            ExternalPC.prototype.payOrder = function (params) {
                this.callExternal("payOrder", JSON.stringify(params));
            };
            ExternalPC.prototype.registerCallBackFunction = function (type, name) {
                this.callExternal("registerCallBackFunction", JSON.stringify({
                    type: type,
                    name: name
                }));
            };
            return ExternalPC;
        })();
        external.ExternalPC = ExternalPC;
    })(external = vox.external || (vox.external = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var global;
    (function (global) {
        var ChainError = (function (_super) {
            __extends(ChainError, _super);
            function ChainError(msg, code, cause) {
                _super.call(this, msg);
                this.code = code;
                this.cause = cause;
            }
            ChainError.prototype.toString = function () {
                var s = _super.prototype.toString;
                if (this.code) {
                    s = "Error #" + this.code + ": " + s + ")";
                }
                if (this.cause) {
                    s = s + " ( caused by: " + this.cause + ")";
                }
                return s;
            };
            ChainError.prototype.toJSON = function () {
                return this.toString;
            };
            return ChainError;
        })(Error);
        global.ChainError = ChainError;
    })(global = vox.global || (vox.global = {}));
})(vox || (vox = {}));
var Null = String.fromCharCode(133);
var vox;
(function (vox) {
    var manager;
    (function (manager) {
        var ContextManager = vox.context.ContextManager;
        var AudioManager = (function () {
            function AudioManager() {
            }
            /**获取是否静音*/
            AudioManager.getMute = function () {
                return AudioManager._mute;
            };
            /**是否设置静音*/
            AudioManager.setMute = function (value) {
                if (AudioManager._mute == value)
                    return;
                AudioManager._mute = value;
                //设置本地存储
                var ext = ContextManager.context.getExternal();
                ext.localStorageSet("mute", value.toString());
                if (AudioManager._mute) {
                    AudioManager.stopAll();
                }
                else if (AudioManager._bgMusicPlaying) {
                    //取消静音，如果以前 播放背景音乐，则播放背景音乐
                    AudioManager.playBGMusic();
                }
            };
            AudioManager.initialize = function () {
                var external = ContextManager.context.getExternal();
                var mute = external.localStorageGet("mute");
                this._mute = (mute == "true");
                //监听声音播放完毕事件
                //TODO
                manager.ExternalEventManager.register("playcallback", AudioManager.onAudioStatus);
            };
            AudioManager.onAudioStatus = function (url, state, curTime, duration) {
                if (state == "ended" && url == AudioManager._bgMusicUrl && !AudioManager._bgMusicLock) {
                    setTimeout(function () {
                        AudioManager._bgMusicLock = true;
                        AudioManager.stopBGMusic();
                        AudioManager.playBGMusic();
                        setTimeout(function () {
                            AudioManager._bgMusicLock = false;
                        }, 5000);
                    }, 200);
                }
                if (state == "ended") {
                    if (this._completeCbk != null) {
                        this._completeCbk();
                    }
                }
            };
            /**播放背景音乐，会循环播放
             * @param url 如果不传则播放之前记录的背景音乐，否则播放本次传递的url*/
            AudioManager.playBGMusic = function (url) {
                if (url != null)
                    AudioManager._bgMusicUrl = url;
                if (AudioManager._bgMusicUrl) {
                    AudioManager.playAudio(AudioManager._bgMusicUrl);
                    AudioManager._bgMusicPlaying = true;
                }
            };
            AudioManager.stopBGMusic = function () {
                if (AudioManager._bgMusicUrl) {
                    AudioManager.stopAudio(AudioManager._bgMusicUrl);
                }
                AudioManager._bgMusicPlaying = false;
            };
            AudioManager.loadAudio = function (url) {
                if (!url)
                    return;
                ContextManager.context.getExternal().loadAudio(url);
            };
            AudioManager.playAudio = function (url, completeCbk) {
                if (completeCbk === void 0) { completeCbk = Null; }
                if (!url)
                    return;
                //静音则不操作
                if (AudioManager.getMute())
                    return;
                //如果已经在播放了，不进行操作
                if (AudioManager._playingUrls.indexOf(url) >= 0)
                    return;
                //记录url
                AudioManager._playingUrls.push(url);
                this._completeCbk = completeCbk;
                //调用外部接口
                ContextManager.context.getExternal().playAudio(url);
            };
            /**暂停播放音频*/
            AudioManager.pauseAudio = function (url) {
                var index = AudioManager._playingUrls.indexOf(url);
                //找不到播放的音频，则直接返回
                if (index < 0)
                    return;
                //调用外壳接口
                ContextManager.context.getExternal().pauseAudio(url);
            };
            AudioManager.seekAudio = function (url, time) {
                var index = AudioManager._playingUrls.indexOf(url);
                if (index < 0)
                    return;
                ContextManager.context.getExternal().seekAudio(url, time);
            };
            AudioManager.stopAudio = function (url) {
                var index = AudioManager._playingUrls.indexOf(url);
                if (index < 0)
                    return;
                //调用外壳接口
                ContextManager.context.getExternal().stopAudio(url);
                //删除记录
                AudioManager._playingUrls.splice(index, 1);
            };
            AudioManager.stopAll = function () {
                var external = ContextManager.context.getExternal();
                while (AudioManager._playingUrls.length > 0) {
                    var url = AudioManager._playingUrls.shift();
                    external.stopAudio(url);
                }
            };
            AudioManager._bgMusicPlaying = false;
            AudioManager._playingUrls = [];
            AudioManager._bgMusicLock = false;
            return AudioManager;
        })();
        manager.AudioManager = AudioManager;
    })(manager = vox.manager || (vox.manager = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var manager;
    (function (manager) {
        var ContextManager = vox.context.ContextManager;
        var ExternalEventManager = (function () {
            function ExternalEventManager() {
            }
            ExternalEventManager.initialize = function () {
                var external = ContextManager.context.getExternal();
                external.registerCallbackFunction("playcallback", "vox.manager.ExternalEventManager.playcallback");
                external.registerCallbackFunction("pauseActivity", "vox.manager.ExternalEventManager.pauseActivity");
            };
            ExternalEventManager.playcallback = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                ExternalEventManager.trigger("playcallback", args);
            };
            ExternalEventManager.pauseActivity = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                ExternalEventManager.trigger("pauseActivity", args);
            };
            ExternalEventManager.trigger = function (type, args) {
                var handlers = ExternalEventManager._listeners[type];
                for (var i in handlers) {
                    var handler = handler[i];
                    if (handler != null) {
                        handler.apply(null, args);
                    }
                }
            };
            ExternalEventManager.register = function (type, handler) {
                var handlers = ExternalEventManager._listeners[type];
                if (handlers == null) {
                    ExternalEventManager._listeners[type] = []; //TODO这里可能有问题 肖建军
                }
                if (handlers.indexOf(handler) < 0) {
                    handlers.push(handler);
                }
            };
            ExternalEventManager.unregister = function (type, handler) {
                var handlers = ExternalEventManager._listeners[type];
                if (handlers == null)
                    return;
                var index = handlers.indexOf(handler);
                if (index > 0) {
                    handlers.splice(index, 1);
                }
            };
            ExternalEventManager._listeners = {};
            return ExternalEventManager;
        })();
        manager.ExternalEventManager = ExternalEventManager;
    })(manager = vox.manager || (vox.manager = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var manager;
    (function (manager) {
        var ContextManager = vox.context.ContextManager;
        var EnvCode = vox.system.EnvCode;
        var LogUtils = vox.utils.LogUtils;
        var LogLevel = vox.utils.LogLevel;
        var AppEvent = vox.events.AppEvent;
        var ModuleManager = (function () {
            function ModuleManager() {
            }
            ModuleManager.initialize = function (proxy) {
                ModuleManager._proxy = proxy;
            };
            /**获取默认模块儿名(第一个注册的模块儿)
             * @return {string}*/
            ModuleManager.getDefaultModule = function () {
                return ModuleManager._defaultModuleName;
            };
            /*把模块类 和 名字 注册到_moduleClasses里面*/
            ModuleManager.registerModule = function (moduleName, moduleClazz) {
                if (ModuleManager._defaultModuleName == null)
                    this._defaultModuleName = moduleName;
                ModuleManager._moduleClasses[moduleName] = moduleClazz;
            };
            /*模块儿是否在活动中
            * @param moduleName
            * @return {boolean} 表示是否正在活动*/
            ModuleManager.isActive = function (moduleName) {
                var result = (ModuleManager._activeModuleDict[moduleName] != null || ModuleManager._loadingModuleDict[moduleName] != null);
                return result;
            };
            /*获取当前模块，其实是最后一个*/
            ModuleManager.getCurModule = function () {
                return ModuleManager._activeModuleList[ModuleManager._activeModuleList.length - 1];
            };
            /*活动模块的个数*/
            ModuleManager.getActiveCount = function () {
                return this._activeModuleList.length;
            };
            /*使用模块名称显示模块
            * @param moduleName 模块儿名称
            * @param data 可能的数据*/
            ModuleManager.showModule = function (moduleName, data) {
                var _this = this;
                if (moduleName == null)
                    return;
                var moduleClass = ModuleManager._moduleClasses[moduleName];
                if (moduleClass == null)
                    return;
                //如果这个模块已经开启，则不进行操作
                if (ModuleManager.isActive(moduleName))
                    return;
                //获取模块对象
                //TODO 没有想清楚 loadFlag的意义
                var loadFlag = true;
                ModuleManager._proxy.getModule(moduleName, moduleClass, function (thisModule) {
                    //初始化模块
                    var context = ContextManager.context;
                    if (context.getSystemConfig().envCode == EnvCode.dev) {
                        thisModule.__initialize();
                    }
                    else {
                        try {
                            thisModule.__initialize();
                        }
                        catch (err) {
                            LogUtils.log(err.toString(), LogLevel.Err);
                        }
                    }
                    //获取上一个模块
                    ModuleManager._lastModule = _this.getCurModule();
                    ModuleManager._lastData = data;
                    var lastModule = ModuleManager._lastModule;
                    //放入活动模块儿表
                    ModuleManager._activeModuleDict[moduleName] = thisModule;
                    ModuleManager._activeModuleList.push(thisModule);
                    //发送准备切换模块儿事件
                    ContextManager.context.dispatch(AppEvent.Evt_PreChangeModule, thisModule, ModuleManager._lastModule);
                    //调用show方法
                    if (context.getSystemConfig().envCode === EnvCode.dev) {
                        thisModule.setShowHandler(function () {
                            thisModule.onActivate(ModuleManager._lastModule, ModuleManager._lastData);
                        });
                        thisModule.show(data);
                    }
                    else {
                        try {
                            thisModule.setShowHandler(function () {
                                try {
                                    thisModule.onActivate(ModuleManager._lastModule, ModuleManager._lastData);
                                }
                                catch (err) {
                                    LogUtils.log(err.toString(), LogLevel.Err);
                                }
                            });
                            thisModule.show(data);
                        }
                        catch (err) {
                            LogUtils.log(err.toString(), LogLevel.Err);
                        }
                    }
                    //发送切换模块儿事件
                    ContextManager.context.dispatch(AppEvent.Evt_ChangeModule, thisModule, lastModule);
                    if (!loadFlag) {
                        ContextManager.context.dispatch(AppEvent.Evt_LoadModuleComplete, moduleName, data);
                    }
                    loadFlag = false;
                });
                if (loadFlag) {
                    loadFlag = false;
                    ContextManager.context.dispatch(AppEvent.Evt_StartLoadModule, moduleName, data);
                }
            };
            /*关闭模块
            * 先pureClose
            * 再发送切换模块事件
            * 然后 TODO 后面做了什么?
            * @param moduleName 模块儿的名称
            * @param data 可能的数据*/
            ModuleManager.closeModule = function (moduleName, data) {
                ModuleManager._lastModule = this.getCurModule();
                ModuleManager._lastData = data;
                //取到活动模块儿表中的内容
                var module = ModuleManager.pureClose(moduleName, data);
                if (module != null) {
                    //获取最新模块儿
                    var curModule = this.getCurModule();
                    //发送准备切换模块儿事件  新的Module 老的Module
                    ContextManager.context.dispatch(AppEvent.Evt_PreChangeModule, curModule, module);
                    //发送切换模块儿事件
                    ContextManager.context.dispatch(AppEvent.Evt_ChangeModule, curModule, module);
                }
            };
            /*退回到指定模块儿
            * @param moduleName 要退回到的模块名称
            * @param data 可能的数据
            * @param {boolean} 如果找到了模块返回true, 没有找到返回false*/
            ModuleManager.backToModule = function (moduleName, data) {
                //取到活动模块儿表中的内容
                var module = ModuleManager._activeModuleDict[moduleName];
                if (module == null)
                    return false;
                //首先将当前模块儿和目标模块儿之间的所有模块儿关闭
                var tempList = ModuleManager._activeModuleList.concat();
                var index = tempList.indexOf(module);
                for (var i = tempList.length - 2; i > index; i--) {
                    var tmpModule = tempList[i];
                    ModuleManager.pureClose(tmpModule.getName(), data);
                }
                //然后正常关闭当前模块
                var curModule = tempList[tempList.length - 1];
                ModuleManager.closeModule(curModule.getName(), data);
                return true;
            };
            //---------------------------内部工具方法-----------------------------------
            /*单纯只是为了关闭
            * 1 执行setCloseHandler dispose
            * 2 从活动列表中清除*/
            ModuleManager.pureClose = function (moduleName, data) {
                //取到活动模块儿表中的内容
                var module = ModuleManager._activeModuleDict[moduleName];
                if (module != null) {
                    //关闭模块
                    var context = ContextManager.context;
                    if (context.getSystemConfig().envCode === EnvCode.dev) {
                        //开发环境不使用try catch，防止查找错误麻烦
                        module.setCloseHandler(function () {
                            //销毁当前模块
                            module.dispose();
                        });
                        module.close(data);
                    }
                    else {
                        try {
                            module.setCloseHandler(function () {
                                try {
                                    module.dispose();
                                }
                                catch (err) {
                                    LogUtils.log(err.toString(), LogLevel.Err);
                                }
                            });
                            module.close(data);
                        }
                        catch (err) {
                            LogUtils.log(err.toString(), LogLevel.Err);
                        }
                    }
                    //从活动模块中移除
                    delete ModuleManager._activeModuleDict[moduleName];
                    ModuleManager._activeModuleList.splice(ModuleManager._activeModuleList.indexOf(module), 1);
                }
                return module;
            };
            ModuleManager._lastModule = null;
            ModuleManager._lastData = null;
            /**名字 对应ModuleClass*/
            ModuleManager._moduleClasses = {};
            /**active 名字 对应 Module*/
            ModuleManager._activeModuleDict = {};
            /**active 名字 对应 IModule*/
            ModuleManager._activeModuleList = [];
            /**正在加载的Module的名字*/
            ModuleManager._loadingModuleDict = {};
            return ModuleManager;
        })();
        manager.ModuleManager = ModuleManager;
    })(manager = vox.manager || (vox.manager = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var manager;
    (function (manager) {
        var NonePopupPolicy = vox.popup.policies.NonePopupPolicy;
        var ButtonType = vox.popup.ButtonType;
        var ContextManager = vox.context.ContextManager;
        var AppEvent = vox.events.AppEvent;
        var MaskUtil = vox.utils.MaskUtil;
        var PopupManager = (function () {
            function PopupManager() {
            }
            /*获取当前显示的弹窗的数量*/
            PopupManager.getCount = function () {
                return this._popupList.length;
            };
            PopupManager.initilize = function (prompt) {
                PopupManager._prompt = prompt;
            };
            /*显示提示窗口*/
            PopupManager.prompt = function (msg) {
                var handlers = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    handlers[_i - 1] = arguments[_i];
                }
                var args = [msg];
                for (var i in handlers) {
                    var handler = handler[i];
                    if (handler.text == null)
                        handler.text = handler.data;
                    if (handler.buttonType == null)
                        handler.buttonType = ButtonType.Normal;
                    args.push(handler);
                }
                PopupManager._prompt.update.apply(PopupManager._prompt, args); //args里有若干参数，一个是msg, 后面都是IPromptHandler
                PopupManager.show(PopupManager._prompt);
            };
            PopupManager.alert = function (msg, okHandler) {
                PopupManager.prompt(msg, { data: "确定", handler: okHandler, buttonType: ButtonType.Important });
            };
            PopupManager.confirm = function (msg, okHandler, cancelHandler) {
                PopupManager.prompt(msg, { data: "确定", handler: okHandler, buttonType: ButtonType.Important }, { data: "取消", handler: cancelHandler, buttonType: ButtonType.Normal });
            };
            //----------------------------------下面是主方法----------------------------------------
            /*显示一个弹窗
            * @param popup 要显示的弹窗
            * @param isModal 是否是模态弹出，默认值是true
            * @param from 从该点弹出 (某些弹出策略需要)*/
            PopupManager.show = function (popup, isModal, from) {
                if (isModal === void 0) { isModal = true; }
                var name = popup.getName();
                //先移除之前的同名弹窗
                PopupManager.close(name);
                //记录弹窗
                PopupManager._popupDict[name] = popup;
                PopupManager._popupList.push(popup);
                //获取弹出策略
                var policy = popup.getPolicy();
                if (policy == null)
                    policy = PopupManager.defaultPolicy;
                if (policy == null)
                    policy = NonePopupPolicy.getInstance();
                //调用弹出前方法
                popup.onBeforeShow();
                //调用弹出策略
                policy.show(popup, popup.onAfterShow.bind(popup), from);
                //如果是模态，则需要遮罩层
                if (isModal)
                    MaskUtil.showModalMask(popup); //TODO
                //派发事件
                ContextManager.context.dispatch(AppEvent.Evt_ShowPopup, popup);
            };
            /*关闭一个弹窗
            * @param popupOrName 弹窗本身或者弹窗名称
            * @param to 关闭到该点 （某些弹出策略的需求）*/
            PopupManager.close = function (popupOrName, to) {
                var popup = null;
                var name;
                if (typeof popupOrName == "string") {
                    name = popupOrName;
                    popup = PopupManager._popupDict[name];
                }
                else {
                    popup = popupOrName;
                    name = popup.getName();
                }
                if (popup == null)
                    return;
                //获取弹窗策略
                var policy = popup.getPolicy();
                if (policy == null)
                    policy = PopupManager.defaultPolicy;
                if (policy == null)
                    policy = NonePopupPolicy.getInstance();
                //调用弹出前的方法
                popup.onBeforeClose();
                //调用弹出策略
                policy.close(popup, popup.onAfterClose.bind(popup), to);
                //删除记录
                delete PopupManager._popupDict[name];
                var index = PopupManager._popupList.indexOf(popup);
                if (index >= 0)
                    PopupManager._popupList.splice(index, 1);
                //移除遮罩
                //TODO
                MaskUtil.hideModalMask(popup);
                //派发事件
                ContextManager.context.dispatch(AppEvent.Evt_ClosePopup);
            };
            PopupManager.defaultPolicy = NonePopupPolicy.getInstance();
            PopupManager._popupDict = {};
            return PopupManager;
        })();
        manager.PopupManager = PopupManager;
    })(manager = vox.manager || (vox.manager = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var scene;
    (function (scene) {
        var policies;
        (function (policies) {
            var NoneScenePolicy = (function () {
                function NoneScenePolicy() {
                }
                NoneScenePolicy.getInstance = function () {
                    if (NoneScenePolicy._instance == null)
                        NoneScenePolicy._instance = new NoneScenePolicy();
                    return NoneScenePolicy._instance;
                };
                /**准备切换场景时调用*/
                NoneScenePolicy.prototype.prepareSwitch = function (sceneFrom, sceneTo) { };
                /**切换场景时调用*/
                NoneScenePolicy.prototype.switch = function (sceneFrom, sceneTo, cbk) {
                    cbk();
                };
                /**准备push场景时调用*/
                NoneScenePolicy.prototype.preparePush = function (sceneFrom, scentTo) { };
                /**push场景时调用*/
                NoneScenePolicy.prototype.push = function (sceneFrom, sceneTo, cbk) {
                    cbk();
                };
                /**pop场景时调用*/
                NoneScenePolicy.prototype.pop = function (sceneFrom, sceneTo, cbk) {
                    cbk();
                };
                return NoneScenePolicy;
            })();
            policies.NoneScenePolicy = NoneScenePolicy;
        })(policies = scene.policies || (scene.policies = {}));
    })(scene = vox.scene || (vox.scene = {}));
})(vox || (vox = {}));
/// <reference path="../scene/IScene.ts"/>
/// <reference path="../scene/IScenePolicy.ts"/>
/// <reference path="../scene/policies/NoneScenePolicy.ts"/>
/**
 * Created by Raykid on 2016/4/14.
 */
var vox;
(function (vox) {
    var manager;
    (function (manager) {
        var SceneManager = (function () {
            function SceneManager() {
            }
            /**
             * 切换场景，替换当前场景，当前场景会被销毁
             * @param scene 要切换到的场景
             * @param data 可能要携带给下一个场景的数据
             */
            SceneManager.switchScene = function (scene, data) {
                // 非空判断
                if (scene == null)
                    return;
                // 如果切入的是第一个场景，则改用pushScene操作
                if (SceneManager._sceneStack.length == 0) {
                    SceneManager.pushScene(scene, data);
                    return;
                }
                // 获取目标场景的弹出策略
                var policy = scene.getPolicy();
                if (policy == null)
                    policy = SceneManager.defaultPolicy;
                if (policy == null)
                    policy = vox.scene.policies.NoneScenePolicy.getInstance();
                // 不是第一个场景，替换掉第一个场景
                var length = SceneManager._sceneStack.length;
                var curScene = SceneManager._sceneStack[length - 1];
                // 调用准备接口
                policy.prepareSwitch(curScene, scene);
                // 前置处理
                curScene.onBeforeSwitchOut(scene, data);
                scene.onBeforeSwitchIn(curScene, data);
                // 调用切换接口
                policy.switch(curScene, scene, function () {
                    SceneManager._sceneStack[length - 1] = scene;
                    // 后置处理
                    curScene.onAfterSwitchOut(scene, data);
                    scene.onAfterSwitchIn(curScene, data);
                });
            };
            /**
             * 切换场景
             * @param scene 要切换到的场景
             * @param data 可能要携带给下一个场景的数据
             */
            SceneManager.pushScene = function (scene, data) {
                // 非空判断
                if (scene == null)
                    return;
                // 获取目标场景的弹出策略
                var policy = scene.getPolicy();
                if (policy == null)
                    policy = SceneManager.defaultPolicy;
                if (policy == null)
                    policy = vox.scene.policies.NoneScenePolicy.getInstance();
                // 插入场景
                var curScene = SceneManager._sceneStack[SceneManager._sceneStack.length - 1];
                // 调用准备接口
                policy.preparePush(curScene, scene);
                // 前置处理
                if (curScene != null)
                    curScene.onBeforeSwitchOut(scene, data);
                scene.onBeforeSwitchIn(curScene, data);
                // 调用切换接口
                policy.push(curScene, scene, function () {
                    SceneManager._sceneStack.push(scene);
                    // 后置处理
                    if (curScene != null)
                        curScene.onAfterSwitchOut(scene, data);
                    scene.onAfterSwitchIn(curScene, data);
                });
            };
            /**
             * 切换场景
             * @param scene 要切换出的场景，仅做验证用，如果当前场景不是传入的场景则不会进行切换场景操作
             * @param data 可能要携带给下一个场景的数据
             */
            SceneManager.popScene = function (scene, data) {
                var length = SceneManager._sceneStack.length;
                // 如果是最后一个场景则什么都不做
                if (length <= 1) {
                    console.log("已经是最后一个场景，无法执行popScene操作");
                    return;
                }
                // 验证是否是当前场景，不是则直接移除，不使用Policy
                var index = SceneManager._sceneStack.indexOf(scene);
                if (index != length - 1) {
                    var curScene = SceneManager._sceneStack[length - 1];
                    // 调用接口
                    scene.onBeforeSwitchOut(curScene, data);
                    scene.onAfterSwitchOut(curScene, data);
                    // 弹出场景
                    SceneManager._sceneStack.splice(index, 1);
                    return;
                }
                // 获取当前场景的弹出策略
                var policy = scene.getPolicy();
                if (policy == null)
                    policy = SceneManager.defaultPolicy;
                if (policy == null)
                    policy = vox.scene.policies.NoneScenePolicy.getInstance();
                // 弹出一个场景
                var targetScene = SceneManager._sceneStack[length - 2];
                // 调用准备接口
                policy.preparePop(scene, targetScene);
                // 前置处理
                scene.onBeforeSwitchOut(targetScene, data);
                targetScene.onBeforeSwitchIn(scene, data);
                // 调用切换接口
                policy.pop(scene, targetScene, function () {
                    SceneManager._sceneStack.pop();
                    // 后置处理
                    scene.onAfterSwitchOut(targetScene, data);
                    targetScene.onAfterSwitchIn(scene, data);
                });
            };
            SceneManager.defaultPolicy = vox.scene.policies.NoneScenePolicy.getInstance();
            SceneManager._sceneStack = [];
            return SceneManager;
        })();
        manager.SceneManager = SceneManager;
    })(manager = vox.manager || (vox.manager = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var model;
    (function (model) {
        var ContextManager = vox.external.ContextManager;
        var BaseModel = (function () {
            function BaseModel() {
                this._context = ContextManager.context;
            }
            BaseModel.prototype.getContext = function () {
                return this._context;
            };
            BaseModel.prototype.dispatch = function (typeOrEvent) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                args.unshift(typeOrEvent);
                this._context.dispatch.apply(this._context, args);
            };
            return BaseModel;
        })();
        model.BaseModel = BaseModel;
    })(model = vox.model || (vox.model = {}));
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
var vox;
(function (vox) {
    var net;
    (function (net) {
        var BaseCommand = vox.command.BaseCommand;
        var MaskUtil = vox.utils.MaskUtil;
        var AppEvent = vox.events.AppEvent;
        var URLUtils = vox.utils.URLUtils;
        var ObjectUtil = vox.utils.ObjectUtil;
        var BaseRequestCommand = (function (_super) {
            __extends(BaseRequestCommand, _super);
            function BaseRequestCommand() {
                _super.apply(this, arguments);
            }
            BaseRequestCommand.prototype.getMessage = function () {
                return this.parameters[0];
            };
            BaseRequestCommand.prototype.onSuccess = function (data) {
                var response = this.parseResponse(data);
                MaskUtil.hideLoading();
                //发送返回事件
                this.dispatch(AppEvent.Evt_Get_Server_Response, response, this.getMessage());
            };
            BaseRequestCommand.prototype.onError = function (err) {
                MaskUtil.hideLoading();
                //发送错误事件
                this.dispatch(AppEvent.Evt_Request_ErrorEvent, error, this.getMessage());
            };
            BaseRequestCommand.prototype.parseResponse = function (result) {
                return null;
            };
            BaseRequestCommand.prototype.trimData = function (data) {
                for (var key in data) {
                    if (data[key] == null) {
                        delete data[key];
                    }
                }
                return data;
            };
            BaseRequestCommand.prototype.exec = function () {
                var msg = this.getMessage();
                if (msg == null)
                    throw new Error("绑定的消息必须实现IRequestMessage接口");
                //判断是否有domain ，没有就什么都不做s
                var cfg = this.context.getSystemConfig();
                if (cfg.domain == null)
                    return;
                //添加遮罩
                MaskUtil.showLoading();
                //发送消息
                var url = msg.__url();
                var domain = msg.__domain;
                if (domain != null)
                    url = URLUtils.wrapHost(url, domain, true);
                //指定消息参数连接上公共参数作为参数
                var data = ObjectUtil.extendObject(msg.__data, net.BaseRequestMessage.__commonData);
            };
            return BaseRequestCommand;
        })(BaseCommand);
        net.BaseRequestCommand = BaseRequestCommand;
    })(net = vox.net || (vox.net = {}));
})(vox || (vox = {}));
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
                this.__domain = null;
                this.__userData = {};
            }
            BaseRequestMessage.prototype.__url = function () {
                return null;
            };
            BaseRequestMessage.prototype.__useGet = function () {
                return false;
            };
            /**设置在这里的属性会在每一个消息中都当做参数传递给后台，且优先级最高*/
            BaseRequestMessage.__commonData = {};
            return BaseRequestMessage;
        })(BaseEvent);
        net.BaseRequestMessage = BaseRequestMessage;
    })(net = vox.net || (vox.net = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var net;
    (function (net) {
        function packArray(arr) {
            var _this = this;
            if (!arr)
                return null;
            var result = arr.map(function (obj) {
                if ($.isArray(obj)) {
                    return _this.packArray(obj);
                }
                else if ($.isFunction(obj.pack)) {
                    return obj.pack();
                }
                else {
                    return obj;
                }
            });
        }
        net.packArray = packArray;
        function parseArray(arr, cls) {
            if (!arr)
                return [];
            var result = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                var value = arr[i];
                if (cls == null) {
                    //子对象是基础类型
                    result.push(value);
                }
                else {
                    //子对象是自定义类型
                    result.push(new cls().parse(value));
                }
            }
            return result;
        }
        net.parseArray = parseArray;
    })(net = vox.net || (vox.net = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var popup;
    (function (popup) {
        (function (ButtonType) {
            ButtonType[ButtonType["Normal"] = 0] = "Normal";
            ButtonType[ButtonType["Important"] = 1] = "Important";
        })(popup.ButtonType || (popup.ButtonType = {}));
        var ButtonType = popup.ButtonType;
    })(popup = vox.popup || (vox.popup = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var popup;
    (function (popup_1) {
        var policies;
        (function (policies) {
            var NonePopupPolicy = (function () {
                function NonePopupPolicy() {
                }
                NonePopupPolicy.getInstance = function () {
                    if (NonePopupPolicy._instance == null) {
                        NonePopupPolicy._instance = new NonePopupPolicy();
                    }
                    return NonePopupPolicy._instance;
                };
                NonePopupPolicy.prototype.show = function (pop, cbk, form) {
                    cbk();
                };
                NonePopupPolicy.prototype.close = function (popup, cbk, to) {
                    cbk();
                };
                return NonePopupPolicy;
            })();
            policies.NonePopupPolicy = NonePopupPolicy;
        })(policies = popup_1.policies || (popup_1.policies = {}));
    })(popup = vox.popup || (vox.popup = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var system;
    (function (system) {
        var SystemConfig = (function () {
            function SystemConfig() {
                this.envCode = EnvCode.dev;
                this.env = "dev";
                this.domain = "http://www.test.17zuoye.net";
                this.imgDomain = "http://cdn-cc.test.17zuoye.net";
                this.mainDomain = "http://www.test.17zuoye.net";
                this.clientType = "";
                this.clientName = "";
                this.app = "";
                this.htmlVersion = "";
                this.userId = "";
                this.uuid = "";
                this.ktwelve = "";
                this.sessionKey = "";
                this.compileVersion = "$( compileVersion )";
                this.nativeVersion = '';
            }
            return SystemConfig;
        })();
        system.SystemConfig = SystemConfig;
        (function (EnvCode) {
            EnvCode[EnvCode["dev"] = 0] = "dev";
            EnvCode[EnvCode["test"] = 1] = "test";
            EnvCode[EnvCode["staging"] = 2] = "staging";
            EnvCode[EnvCode["production"] = 3] = "production";
        })(system.EnvCode || (system.EnvCode = {}));
        var EnvCode = system.EnvCode;
    })(system = vox.system || (vox.system = {}));
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
/// <reference path="../../../ThirdParty/jquery.d.ts"/>
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var ErrorCode = vox.enums.ErrorCode;
        var ChainError = vox.global.ChainError;
        (function (Method) {
            Method[Method["Get"] = 1] = "Get";
            Method[Method["Head"] = 2] = "Head";
            Method[Method["Post"] = 3] = "Post";
            Method[Method["Put"] = 4] = "Put";
            Method[Method["Delete"] = 5] = "Delete";
            Method[Method["Connect"] = 6] = "Connect";
            Method[Method["Options"] = 7] = "Options";
            Method[Method["Trace"] = 8] = "Trace";
        })(utils.Method || (utils.Method = {}));
        var Method = utils.Method;
        (function (ContentType) {
            ContentType[ContentType["Form"] = 1] = "Form";
            ContentType[ContentType["Json"] = 2] = "Json";
        })(utils.ContentType || (utils.ContentType = {}));
        var ContentType = utils.ContentType;
        var ContentTypeMap = (_a = {},
            _a[ContentType.Form] = "application/x-www-form-urlencoded",
            _a[ContentType.Json] = "application/json",
            _a
        );
        var LoadUtil = (function () {
            function LoadUtil(name) {
                this.reloadTimes = 0;
                this.dataStr = "";
                this.name = name;
            }
            LoadUtil.prototype.load = function (url, setting) {
                utils.LogUtils.log("[Service] \u53D1\u9001\u8BF7\u6C42: " + url);
                this.setting = setting;
                //补齐通用设置
                for (var key in LoadUtil.commonSettings) {
                    if (!setting.hasOwnProperty(key)) {
                        setting[key] = LoadUtil.commonSettings[key];
                    }
                }
                if (!url) {
                    utils.LogUtils.log("[Service] url\u9519\u8BEF: " + url);
                    if (setting.onError) {
                        setting.onError(new ChainError("Invalid url: " + url, ErrorCode.HTTP_REQUEST_ERROR));
                        return;
                    }
                }
                this.url = url;
                this.dataStr = "";
                if (typeof setting.data == "object") {
                    if (setting.data) {
                        if (setting.method == Method.Post && setting.contentType == ContentType.Json) {
                            try {
                                this.dataStr = utils.JSONUtil.stringify(setting.data);
                            }
                            catch (error) {
                                utils.LogUtils.log(error, utils.LogLevel.Err);
                                if (setting.onError) {
                                    setting.onError(new ChainError("json序列化错误", ErrorCode.JSON_STRINGIFY_ERROR, error));
                                    return;
                                }
                            }
                        }
                        else {
                            this.dataStr = $.param(setting.data);
                        }
                    }
                }
                else {
                    if (setting.data) {
                        this.dataStr = setting.data.toString();
                    }
                }
                var userData = {};
                userData._lv = utils.LogLevel.Info;
                userData.module = "serive";
                userData.op = "request_start";
                var etcData = {};
                etcData.name = this.name;
                etcData.url = this.url;
                etcData.proxy = setting.proxy;
                etcData.method = Method[setting.method];
                etcData.contentType = setting.contentType;
                etcData.dataType = setting.dataType;
                etcData.retryTimes = setting.reloadTimes;
                utils.LogUtils.remoteLog(userData, etcData);
                this.reloadTimes = 0;
                this.send();
            };
            LoadUtil.prototype.send = function () {
                if (this.setting.proxy && this.externalLoadFunc) {
                    this.externalLoadFunc(this);
                }
                else {
                    $.ajax(this.url, {
                        context: this,
                        url: this.url,
                        type: Method[this.setting.method],
                        timeout: this.setting.timeout,
                        dataFilter: this.setting.dataFilter,
                        success: this.onSuccess,
                        error: this.onError,
                        complete: this.onComplete,
                        contentType: ContentTypeMap[this.setting.contentType],
                        data: this.dataStr,
                        async: !this.setting.sync
                    });
                }
            };
            LoadUtil.prototype.onSuccess = function (data, textStatus, jqXHR) {
                utils.LogUtils.log("[Service] success: " + this.url);
                if (this.setting.onSuccess) {
                    this.setting.onSuccess(data);
                }
            };
            LoadUtil.prototype.onError = function (jqXHR, txtStatus, errThrown) {
                utils.LogUtils.log("[Service] error: " + errThrown, utils.LogLevel.Err);
                if (txtStatus == "abort") {
                    return;
                }
                var errCode;
                if (txtStatus == "parseerror") {
                    errCode = ErrorCode.JSON_PARSE_ERROR;
                }
                else if (txtStatus == "timeout") {
                    errCode = ErrorCode.HTTP_REQUEST_TIMEOUT;
                }
                else {
                    errCode = ErrorCode.HTTP_REQUEST_ERROR;
                }
                //记录日志
                var info = {
                    name: this.name,
                    url: this.url,
                    textStatus: txtStatus || "",
                    errorThrown: errThrown ? errThrown.toString() : "",
                    method: this.setting.method,
                    requestType: ContentTypeMap[this.setting.contentType],
                    requestData: this.setting.data,
                    dataType: this.setting.dataType,
                    responseType: this.responseType,
                    responseData: this.responseData,
                    retryTimes: this.reloadTimes,
                    location: window.location
                };
                if (this.setting.proxy) {
                    info.proxy = true;
                }
                else {
                    if (jqXHR) {
                        info.readyState = jqXHR.readyState;
                        info.status = jqXHR.status;
                    }
                }
                utils.LogUtils.remoteLog({
                    _lv: utils.LogLevel.Err,
                    module: "service",
                    op: "request_error",
                    err_code: errCode
                }, info);
                //还有重试次数的话先重试
                if (this.reloadTimes < this.setting.reloadTimes) {
                    this.reloadTimes++;
                    utils.LogUtils.log("[Service] \u8BF7\u6C42\u5931\u8D25\uFF0C\u8FDB\u884C\u91CD\u8BD5(\u7B2C" + this.reloadTimes + "\u6B21\uFF0C\u5269\u4F59" + (this.setting.reloadTimes - this.reloadTimes) + "\u6B21)\uFF0Curl=" + this.url);
                    var self = this;
                    var flag = setTimeout(function () {
                        clearTimeout(flag);
                        self.send();
                    }, 150);
                }
                else if (this.setting.onError) {
                    this.setting.onError(new ChainError(errThrown ? errThrown.toString() : txtStatus, errCode));
                }
            };
            LoadUtil.prototype.onComplete = function (jqXHR, txtStatus) {
                if (this.setting.onComplete) {
                    this.setting.onComplete();
                }
            };
            LoadUtil.prototype.dataFilter = function (data, type) {
                this.responseData = data;
                this.responseType = type;
                if (this.setting.dataFilter) {
                    data = this.setting.dataFilter(data, type);
                }
                return data;
            };
            LoadUtil.commonSettings = {
                method: Method.Get,
                timeout: 10000,
                reloadTimes: 2,
                contentType: ContentType.Form,
                dataType: 'text',
                sync: false,
                proxy: false
            };
            return LoadUtil;
        })();
        utils.LoadUtil = LoadUtil;
        var _a;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        (function (LogLevel) {
            LogLevel[LogLevel["Debug"] = 0] = "Debug";
            LogLevel[LogLevel["Info"] = 1] = "Info";
            LogLevel[LogLevel["Notice"] = 2] = "Notice";
            LogLevel[LogLevel["Warning"] = 3] = "Warning";
            LogLevel[LogLevel["Err"] = 4] = "Err";
            LogLevel[LogLevel["Crit"] = 5] = "Crit";
            LogLevel[LogLevel["Alert"] = 6] = "Alert";
            LogLevel[LogLevel["Emeg"] = 7] = "Emeg";
        })(utils.LogLevel || (utils.LogLevel = {}));
        var LogLevel = utils.LogLevel;
        var LogUtils = (function () {
            function LogUtils() {
            }
            /**本地日志
             * @param msg
             * @param level*/
            LogUtils.log = function (msg, level) {
                if (level === void 0) { level = LogLevel.Debug; }
                if (!(level >= 0))
                    level = LogLevel.Debug; //如果没有输入level，则默认为最低级别的 Log
                if (level < LogUtils.maxLogLevel)
                    return; //如果不够危险，即低于 maxLogLevel 则不记录日志
                if (msg === null || msg === undefined)
                    msg = "";
                msg = LogLevel[level] + "" + new Date().toLocaleString() + msg;
                //for console
                if ((typeof console) !== "undefinded" && console) {
                    if (console.error && level >= LogLevel.Err) {
                        console.error(msg);
                    }
                    else {
                        console.log(msg);
                    }
                }
                //for external
            };
            LogUtils.remoteLog = function (userBaseData, userEtcData) {
            };
            /**基础字段*/
            LogUtils.commonBaseData = {};
            /**扩展字段*/
            LogUtils.commonEtcData = {};
            /**log级别限制，低于此级别的log不会显示，其实级别越高，危险越高*/
            LogUtils.maxLogLevel = LogLevel.Debug;
            /**Pingback级别限制，低于此级别的log不会发送，其实级别越高，危险越高*/
            LogUtils.maxPingbackLevel = LogLevel.Debug;
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
        var MaskUtil = vox.net.MaskUtil;
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
            MaskUtil.showMask = function (alpha) {
                if (MaskUtil._entity != null)
                    MaskUtil._entity.showMask(alpha);
            };
            MaskUtil.hideMask = function () {
                if (MaskUtil._entity != null)
                    MaskUtil._entity.hideMask();
            };
            MaskUtil.isShowingMask = function () {
                if (MaskUtil._entity != null)
                    return MaskUtil._entity.isShowingMask();
                return false;
            };
            MaskUtil.showModalMask = function (popup, alpha) {
                if (MaskUtil._entity != null)
                    MaskUtil._entity.showModalMask(popup, alpha);
            };
            MaskUtil.hideModalMask = function (popup) {
                if (MaskUtil._entity != null)
                    MaskUtil._entity.hideModalMask(popup);
            };
            MaskUtil.isShowingModalMask = function (popup) {
                if (MaskUtil._entity != null)
                    return MaskUtil._entity.isShowingModalMask(popup);
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
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var ContextManager = vox.external.ContextManager;
        var ChainError = vox.global.ChainError;
        var URLUtils = (function () {
            function URLUtils() {
            }
            /**规整url*/
            URLUtils.trimUrl = function (url) {
                // 去除多余的"/"
                url = url.replace(/([^:/])(\/)+/g, "$1/");
                // 处理 "/xx/../"
                url = url.replace(/\/[^\/]+?\/\.\.\//g, "/");
                return url;
            };
            /**替换url中的host的工具方法*/
            URLUtils.wrapHost = function (url, host, forced) {
                if (forced === void 0) { forced = false; }
                host = host || "/";
                var regExp = /^(?:[^\/]+):\/{2,}(?:[^\/]+)\//;
                var arr = url.match(regExp);
                if (arr && arr.length > 0) {
                    if (forced) {
                        url = url.substr(arr[0].length);
                        url = host + "/" + url;
                    }
                }
                else {
                    url = host + "/" + url;
                }
                url = URLUtils.trimUrl(url);
                return url;
            };
            /**把url里的host替换成 domain */
            URLUtils.wrapRequestUrl = function (url, forced) {
                var cfg = ContextManager.context.getSystemConfig();
                if (cfg.domain) {
                    return URLUtils.wrapHost(url, cfg.domain, forced);
                }
                else {
                    return url;
                }
            };
            /**将相对于当前页面的相对路径包装成绝对路径
             * 看不懂 肖建军*/
            URLUtils.wrapAbsolutePath = function (relativePath) {
                var curPath = window.location.href;
                var tempIndex = curPath.lastIndexOf("/");
                curPath = curPath.substring(0, tempIndex + 1);
                return URLUtils.trimUrl(curPath + relativePath);
            };
            /**获取url的host+pathname部分，即问号?以前的部分*/
            URLUtils.getHostAndPathName = function (url) {
                if (url == null)
                    throw new ChainError("url不能为空");
                return url.split("?")[0];
            };
            /**解析url查询参数*/
            URLUtils.getQueryParams = function (url) {
                var params = {};
                var queryString = url.substring(url.search(/\?/) + 1);
                var kvs = queryString.split("&");
                kvs.forEach(function (kv) {
                    var pair = kv.split("=", 2);
                    if (pair.length !== 2 || !pair[0]) {
                        utils.LogUtils.log("[URLUtils] invalid query params:" + kv);
                        return;
                    }
                    var key = decodeURIComponent(pair[0]);
                    var value = decodeURIComponent(pair[1]);
                    params[key] = value;
                });
                return params;
            };
            /**将参数连接到指定URL后面
             * @param url url
             * @param params 一个map 包含要连接的参数
             * @return string 连接后的url地址*/
            URLUtils.joinQueryParams = function (url, params) {
                if (url == null)
                    throw new ChainError("url不能为空");
                var oriParams = URLUtils.getQueryParams(url);
                var targetParams = utils.ObjectUtil.extendObject(oriParams, params);
                url = URLUtils.getHostAndPathName(url);
                var isFirst = true;
                for (var key in targetParams) {
                    if (isFirst) {
                        isFirst = false;
                        url += "?" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
                    }
                    else {
                        url += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
                    }
                }
                return url;
            };
            return URLUtils;
        })();
        utils.URLUtils = URLUtils;
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
/// <reference path="StateContext.ts"/>
/// <reference path="State.ts"/>
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var statemachine;
        (function (statemachine) {
            /**
             * 功能: 状态机
             * <br>
             * 版权: ©Raykid
             * <br>
             * 作者: Raykid
             */
            var StateMachine = (function () {
                function StateMachine() {
                    this._states = [];
                    this._running = false;
                    this._pause = false;
                    this._pauseData = null;
                    this._tempUserData = {};
                    /** 是否在添加状态时自动立即运行状态机，默认为false */
                    this.autoRun = false;
                    this._context = new statemachine.StateContext(this);
                }
                /** 获取状态机当前是否正在运行 */
                StateMachine.prototype.getRunning = function () {
                    return this._running;
                };
                /** 获取用户数据，可以修改其中的值，这些值在状态机一次生命周期中会一直奏效 */
                StateMachine.prototype.getUserData = function () {
                    return this._context.getUserData();
                };
                StateMachine.prototype.onUpdate = function (delta) {
                    // 调用当前状态的onUpdate方法，并把毫秒间隔传递过去
                    this._states[0].onUpdate(this._context, delta);
                };
                StateMachine.prototype.addUserData = function (key, value) {
                    if (this._context != null)
                        this._context.getUserData()[key] = value;
                    else
                        this._tempUserData[key] = value;
                };
                /**
                 * 添加一个或多个状态
                 * @param state 要添加的状态
                 * @param more 可能要添加的更多状态
                 * @return 返回当前状态数量
                 */
                StateMachine.prototype.add = function (state) {
                    var more = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        more[_i - 1] = arguments[_i];
                    }
                    more.unshift(state);
                    for (var i = 0, len = more.length; i < len; i++) {
                        var temp = more[i];
                        if (temp != null) {
                            this._states.push(temp); //添加state到_states里
                            temp.onAdd(this._context); //把context添加给state
                        }
                    }
                    if (this._pause && this.autoRun)
                        this.resume(); //如果当前是暂停的，且是自己开始的，则一添加就自动开始
                    return this._states.length;
                };
                /**
                 * 弹出当前的状态 并且去执行后面的状态
                 * @param state 要结束的状态，必须与当前状态吻合才会奏效。如果传递null则默认是结束当前状态（慎用）
                 * @return 弹出的状态
                 */
                StateMachine.prototype.shift = function (state) {
                    if (this._states.length == 0)
                        return null;
                    var stateExit = this._states[0];
                    if (state != null && stateExit != state)
                        return null;
                    // 调用onExit方法，获得传递给下一个状态的参数，这个参数是来自于调用State constructor里面callback的返回
                    var data = stateExit.onExit(this._context);
                    // 调用onRemove方法，并且将该状态移除掉， 这个参数是来自于调用State constructor里面callback的->置为 null
                    stateExit.onRemove(this._context);
                    this._states.shift(); //移除_states里第一个状态
                    if (this._pause) {
                        // 如果有暂停，则暂时停止执行下一个状态
                        this._pauseData = data;
                    }
                    else if (this._states.length == 0) {
                        // 已经没有下一个状态了，自动暂停状态机
                        this.pause();
                        this._pauseData = data;
                    }
                    else {
                        // 准备进入下一个状态：
                        // 还有下一个状态。如果需要跳过，则直接跳过该状态进入下一个状态，否则进入该状态
                        var entered = false;
                        for (var i = 0, len = this._states.length; i < len; i++) {
                            var stateEnter = this._states[0];
                            if (!this._context.skip || !stateEnter.skippable()) {
                                entered = true;
                                stateEnter.onEnter(this._context, data);
                                break;
                            }
                            this._states.shift();
                        }
                        // 如果跳过了所有状态，则自动暂停状态机
                        if (!entered) {
                            this.pause();
                            this._pauseData = data;
                        }
                    }
                    return stateExit;
                };
                /**
                 * 手动pass掉当前状态，直接进入下一状态
                 * @param forceFinish 是否在pass掉状态时直接完成该状态
                 * @return 被pass掉的状态
                 */
                StateMachine.prototype.pass = function (forceFinish) {
                    if (this._states.length == 0)
                        return null;
                    var state = this._states[0];
                    var manualDelete = state.onPass(this._context, forceFinish);
                    if (!manualDelete)
                        this.shift(state);
                    return state;
                };
                /** 启动状态机 */
                StateMachine.prototype.start = function () {
                    if (!this._running) {
                        // 拷贝所有参数
                        for (var key in this._tempUserData) {
                            this._context.getUserData()[key] = this._tempUserData[key];
                            delete this._tempUserData[key];
                        }
                        this._running = true;
                        if (this._states.length > 0) {
                            // 进入第一个状态
                            this._states[0].onEnter(this._context, null);
                            // resume
                            this.resume();
                        }
                        else {
                            this.pause();
                        }
                    }
                };
                /** 停止状态机 */
                StateMachine.prototype.stop = function () {
                    if (this._running) {
                        // 调用第一个状态的onExit方法
                        if (this._states.length > 0)
                            this._states[0].onExit(this._context);
                        this._running = false;
                        // 销毁上下文
                        this._context.clear();
                        // 恢复暂停状态
                        this._pause = false;
                        this._pauseData = null;
                    }
                };
                /** 暂停在当前状态 */
                StateMachine.prototype.pause = function () {
                    this._pause = true;
                };
                /** 重新开启 */
                StateMachine.prototype.resume = function () {
                    if (this._pause && this._states.length > 0) {
                        this._pause = false;
                        // 还有下一个状态，进入下一个状态
                        var stateEnter = this._states[0];
                        var data = this._pauseData;
                        this._pauseData = null;
                        stateEnter.onEnter(this._context, data);
                    }
                };
                /** 跳过所有状态 */
                StateMachine.prototype.skipAllStates = function () {
                    this._context.skip = true;
                };
                /** 清理所有状态 */
                StateMachine.prototype.clear = function () {
                    this.stop();
                    // 移除掉所有状态
                    for (var i = 0, len = this._states.length; i < len; i++) {
                        // 调用onRemove方法，并且将该状态移除掉
                        this._states[0].onRemove(this._context);
                        this._states.shift();
                    }
                };
                /**
                 * 托管状态机，如果状态内有需要update的状态，就需要托管。如果没有则可以不托管
                 * @param stateMachine 要托管的状态机
                 */
                StateMachine.delegateStateMachine = function (stateMachine) {
                    if (StateMachine._stateMachines.indexOf(stateMachine) < 0)
                        StateMachine._stateMachines.push(stateMachine);
                    if (!StateMachine._updating) {
                        PIXI.ticker.shared.add(StateMachine.onEnterFrame);
                        StateMachine._lastTime = new Date().getTime();
                        StateMachine._updating = true;
                    }
                };
                /**
                 * 取消托管状态机
                 * @param stateMachine 要取消托管的状态机
                 */
                StateMachine.undelegateStateMachine = function (stateMachine) {
                    var index = StateMachine._stateMachines.indexOf(stateMachine);
                    if (index >= 0)
                        StateMachine._stateMachines.splice(index, 1);
                    if (StateMachine._updating) {
                        PIXI.ticker.shared.remove(StateMachine.onEnterFrame);
                        StateMachine._lastTime = 0;
                        StateMachine._updating = false;
                    }
                };
                StateMachine.onEnterFrame = function (deltaTime) {
                    // 计算毫秒间隔
                    var time = new Date().getTime();
                    var delta = time - StateMachine._lastTime;
                    StateMachine._lastTime = time;
                    // 调用每一个已启动的状态机的onUpdate方法，将毫秒间隔传递过去
                    for (var i = 0, len = StateMachine._stateMachines.length; i < len; i++) {
                        var stateMachine = StateMachine._stateMachines[i];
                        if (stateMachine.getRunning())
                            stateMachine.onUpdate(delta);
                    }
                };
                StateMachine._stateMachines = [];
                StateMachine._updating = false;
                return StateMachine;
            })();
            statemachine.StateMachine = StateMachine;
        })(statemachine = utils.statemachine || (utils.statemachine = {}));
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
/// <reference path="StateMachine.ts"/>
/// <reference path="State.ts"/>
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var statemachine;
        (function (statemachine) {
            /**
             * 功能: 状态机一个生命周期内的上下文
             * <br>
             * 版权: ©Raykid
             * <br>
             * 作者: Raykid
             */
            var StateContext = (function () {
                function StateContext(stateMachine) {
                    this._userData = {};
                    /** 获取或设置是否跳过剩余可跳过的状态 */
                    this.skip = false;
                    this._stateMachine = stateMachine;
                }
                /** 在一个状态机生命周期中可以保存任意数据，状态机生命周期结束后将被销毁 */
                StateContext.prototype.getUserData = function () { return this._userData; };
                /** 获取或设置状态机自动运行状态 */
                StateContext.prototype.getAutoRun = function () { return this._stateMachine.autoRun; };
                StateContext.prototype.setAutoRun = function (value) { this._stateMachine.autoRun = value; };
                /**
                 * 添加一个或多个状态到当前状态机，该方法为状态提供在运行时动态增加状态机状态的机会
                 * @param state 要添加的状态
                 * @param more 可能要添加的更多状态
                 * @return 返回当前状态数量
                 */
                StateContext.prototype.addState = function (state) {
                    var more = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        more[_i - 1] = arguments[_i];
                    }
                    more.unshift(state);
                    //添加state到状态机的_states里面, 并且把_context置给state, 返回_states长度
                    return this._stateMachine.add.apply(this._stateMachine, more);
                };
                /**
                 * 当需要结束状态时调用该方法即可
                 * @param state 要结束的状态，必须与当前状态吻合才会奏效。如果传递null则默认是结束当前状态（慎用）
                 */
                StateContext.prototype.finish = function (state) {
                    // 之所以要用setTimeout，是因为防止堆栈溢出
                    setTimeout(this._stateMachine.shift, 0, state);
                };
                /** 清理状态机上下文对象 */
                StateContext.prototype.clear = function () {
                    for (var key in this._userData) {
                        delete this._userData[key];
                    }
                };
                return StateContext;
            })();
            statemachine.StateContext = StateContext;
        })(statemachine = utils.statemachine || (utils.statemachine = {}));
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
/// <reference path="../State.ts"/>
/// <reference path="../StateContext.ts"/>
var vox;
(function (vox) {
    var utils;
    (function (utils) {
        var statemachine;
        (function (statemachine) {
            var states;
            (function (states) {
                /**
                 * 功能: 可以用来执行一个方法的状态，可以将方法返回值传递给下一个状态
                 * <br>
                 * 版权: ©Raykid
                 * <br>
                 * 作者: Raykid
                 */
                var FunctionState = (function () {
                    function FunctionState(callback, thisArg) {
                        var args = [];
                        for (var _i = 2; _i < arguments.length; _i++) {
                            args[_i - 2] = arguments[_i];
                        }
                        this._callback = callback;
                        this._thisArg = thisArg;
                        this._args = args;
                    }
                    FunctionState.prototype.skippable = function () {
                        return true;
                    };
                    FunctionState.prototype.onAdd = function (context) {
                    };
                    FunctionState.prototype.onEnter = function (context, data) {
                        if (this._callback != null) {
                            var args = [context].concat(this._args);
                            this._returnValue = this._callback.apply(this._thisArg, args);
                        }
                        context.finish(this);
                    };
                    FunctionState.prototype.onUpdate = function (context, delta) {
                    };
                    FunctionState.prototype.onPass = function (context, forceFinish) {
                        return false;
                    };
                    FunctionState.prototype.onExit = function (context) {
                        // 将方法返回值传递给下一个状态
                        return this._returnValue;
                    };
                    FunctionState.prototype.onRemove = function (context) {
                        this._returnValue = null;
                    };
                    return FunctionState;
                })();
                states.FunctionState = FunctionState;
            })(states = statemachine.states || (statemachine.states = {}));
        })(statemachine = utils.statemachine || (utils.statemachine = {}));
    })(utils = vox.utils || (vox.utils = {}));
})(vox || (vox = {}));
//# sourceMappingURL=Freedom.js.map