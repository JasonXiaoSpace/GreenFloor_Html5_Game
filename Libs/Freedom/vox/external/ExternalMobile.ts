/// <reference path="IExternal.ts"/>
/// <reference path="../utils/JSONUtil.ts"/>

namespace vox.external
{
    import LogUtils = vox.utils.LogUtils;
    import LogUtils = vox.utils.LogUtils;
    /**
     * 移动端外壳基类
     */
    export class ExternalMobile implements vox.external.IExternal
    {
        public getOSType():vox.external.OSType
        {
            return -1;
        }

        public mute:boolean = false;

        public loadAudio(url:string):void
        {
            this.callExternal("loadAudio", url);
        }

        public playAudio(url:string):void
        {
            this.callExternal("playAudio", url);
        }

        public pauseAudio(url:string):void
        {
            this.callExternal("pauseAudio", url);
        }

        public seekAudio(url:string, time:number):void
        {
            this.callExternal("seekAudio", url, time);
        }

        public stopAudio(url?:string):void
        {
            this.callExternal("stopAudio", url);
        }

        public innerJump(name:string):void
        {
            this.callExternal("innerJump", JSON.stringify({name:name}));
        }

        public homeworkHTMLLoaded():void
        {
            this.callExternal("homeworkHTMLLoaded");
        }

        public localStorageSet(key:string, value:string):void
        {
            if(window.external["localStorageSet"] != null)
            {
                var sc:vox.system.SystemConfig = vox.context.ContextManager.context.getSystemConfig();
                var env:string = sc.env;
                var app:string = sc.app;
                this.callExternal("localStorageSet", JSON.stringify({
                    category: env + "." + app,
                    key: key,
                    value: value
                }));
            }
        }

        public localStorageGet(key:string):string
        {
            if(window.external["localStorageGet"] != null)
            {
                var sc:vox.system.SystemConfig = vox.context.ContextManager.context.getSystemConfig();
                var env:string = sc.env;
                var app:string = sc.app;
                var resultStr:string = this.callExternal("localStorageGet", JSON.stringify({
                    category: env + "." + app,
                    key: key
                }));
                var result:any = JSON.parse(resultStr);
                if(result.success) return result.value;
                else return null;
            }
            return null;
        }

        public localStorageRemove(key:string):void
        {
            if(window.external["localStorageRemove"] != null)
            {
                var sc:vox.system.SystemConfig = vox.context.ContextManager.context.getSystemConfig();
                var env:string = sc.env;
                var app:string = sc.app;
                this.callExternal("localStorageRemove", JSON.stringify({
                    category: env + "." + app,
                    key: key
                }));
            }
        }

        public localStorageClear():void
        {
            if(window.external["localStorageClear"] != null)
            {
                var sc:vox.system.SystemConfig = vox.context.ContextManager.context.getSystemConfig();
                var env:string = sc.env;
                var app:string = sc.app;
                this.callExternal("localStorageClear", JSON.stringify({
                    category: env + "." + app
                }));
            }
        }

        private _initParams: Object;
        public getInitParams(refresh?: boolean): any
        {
            if (this._initParams && !refresh)
            {
                return this._initParams;
            }
            this._initParams = vox.utils.URLUtils.getQueryParams(window.location.href);
            var params: Object = (this._initParams || {});

            var result: any = this.callExternal("getInitParams");
            if (result !== this._symbolExternalNotExsist)
            {
                LogUtils.log(`[external getInitParams] result: ${result}`);
                var externalParams: any;
                try
                {
                    externalParams = JSON.parse(result);
                }
                catch (err)
                {
                    LogUtils.log(`[external getInitParams] json解析失败: ${err}`);
                    vox.manager.PopupManager.alert(`获取初始参数失败: ${err}`);
                }

                vox.utils.ObjectUtil.extendObject(params, externalParams);
            }

            this._initParams = params;
            return params;
        }

        private _symbolExternalNotExsist: Object = {};
        public callExternal(funcName: string, ...paramsList: any[]): any
        {
            // 调用外部接口
            if (typeof window.external[funcName] === "function")
            {
                vox.utils.LogUtil.log(`[call external] ${funcName}, params: ${JSON.stringify(paramsList) }`);
                return window.external[funcName].apply(window.external, paramsList);
            }
            else
            {
                vox.utils.LogUtil.log(`[no external] ${funcName}, params: ${JSON.stringify(paramsList) }`);
                return this._symbolExternalNotExsist;
            }
        }

        public updateTitle(str: string, txtColor?: number, bgColor?: number): void
        {
            this.callExternal("updateTitle", str, txtColor.toString(16), bgColor.toString(16));
        }

        public redirectToLogin(from: string): void
        {
            from = from || "";
            this.callExternal("redirectLogin", from);
        }

        public getPlatform(): vox.enums.Platform
        {
            return -1;
        }

        public pageQueueNew(params: { url: string, name: string, orientation?: string, initParams?: { [key: string]: string } }): void
        {
            var temp:any = params;
            if(temp.initParams != null) temp.initParams = vox.utils.JSONUtil.stringify(params.initParams);
            this.callExternal("pageQueueNew", JSON.stringify(temp));
        }

        public pageQueueBack(params: { name?: string, index?: number, step?: number, url?: string, initParams?: { [key: string]: string } }): void
        {
            this.callExternal("pageQueueBack", JSON.stringify(params));
        }

        public pageQueueRefresh(params?: Object): void
        {
            this.callExternal("pageQueueRefresh", JSON.stringify(params));
        }

        public pageQueueQuit(params?: Object): void
        {
            this.callExternal("pageQueueQuit", JSON.stringify(params));
        }

        public refreshData(): void
        {
            this.callExternal("refreshData");
        }

        public showlog(msg:string):void
        {
            // 调用外壳接口
            //this.callExternal("showlog", msg);
        }

        public log_b(data: { [name: string]: any }): void
        {
            if (data == null) return;
            var dataStr: string = JSON.stringify(data);
            // 调用外壳接口
            this.callExternal("log_b", "", dataStr);
        }

        public payOrder(params:PayOrderParams):void
        {
            this.callExternal("payOrder", JSON.stringify(params));
        }

        public registerCallBackFunction(type:string, name:string):void
        {
            this.callExternal("registerCallBackFunction", JSON.stringify({
                type:type,
                name:name
            }));
        }

        public unregisterCallBackFunction(type:string, name:string):void
        {
            this.callExternal("unregisterCallBackFunction", JSON.stringify({
                type:type,
                name:name
            }));
        }
    }
}

/**
 * 下面这堆代码是为了防止壳调用老接口产生大量错误而加的
 */
namespace vox.task
{
    export function loadAudioProgress(url, state, currentTime, duration):void {

    }

    export function playAudioProgress(url, state, currentTime, duration):void {

    }

    export function stateNotification(value):void {

    }

    export function scoreComplete(id, data, err):void {

    }

    export function pauseHTML(isPaused):void {

    }

    export function uploadPhotoCallback():void {

    }

    export function refreshData(params):void {
        // 派发刷新通知
        vox.context.ContextManager.context.dispatch("refreshData", params);
    }

    export function uploadVoiceCallback():void {

    }
}