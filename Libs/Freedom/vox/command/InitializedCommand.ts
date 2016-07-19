namespace vox.command{
    import AudioManager = vox.manager.AudioManager;
    import ExternalEventManager = vox.manager.ExternalEventManager;
    import LogUtils = vox.utils.LogUtils;
    import LogLevel = vox.utils.LogLevel;
    export class InitializedCommand extends BaseCommand{
        private _initRequestList:BaseRequestMessage[] ;

        public exec():void
        {
            AudioManager.initialize() ;
            ExternalEventManager.initialize() ;

            //如果没有外壳参数，则捏造一个
            if( window["external"]["getInitParams"] == null ){
                window["external"] = {
                    getInitParam:()=>{
                        return JSON.stringify({domain:"https://www.test.17zuoye.net"});
                    },
                    payOrder:()=>{
                        alert("payOrder");
                    }
                }
            }

            //全局错误捕获
            var appName:string = this.context.getSystemConfig().app ;
            window.onerror = function( errMsg, scriptURI, lineNumber, columnNumber, errObj ){
                LogUtils.remoteLog(
                    {
                        _lv:LogLevel.Err,
                        module:appName,
                        op:"window.onerror",
                        msg:errMsg
                    },
                    {
                        errorMessage:errMsg,
                        scriptURI:scriptURI,
                        lineNumber:lineNumber,
                        columnNumber:columnNumber,
                        errorObj:errObj,
                        currentModule:ModuleManager.getCurModule().getName()
                    }

                )
            }
        }
    }
}