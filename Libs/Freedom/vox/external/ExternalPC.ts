namespace vox.external{
    import SystemConfig = vox.system.SystemConfig;
    import ContextManager = vox.context.ContextManager;
    import ContextManager = vox.context.ContextManager;
    import URLUtils = vox.utils.URLUtils;
    import Platform = vox.enums.Platform;
    import JSONUtil = vox.utils.JSONUtil;
    export class ExternalPC implements IExternal{

        public mute                 :boolean = false ;
        private _initParams         :Object ;
        private _symbolExternalNotExist:Object = {} ;

        //---------------------------getter----------------------
        public getOSType():OSType{
            return OSType.PC ;
        }



        public loadAudio(url:string):void
        {
            if( window.external["loadAudio"]!=null){
                window.external["loadAudio"]( url ) ;
            }
        }

        public playAudio(url:string):void
        {
            if( window.external["playAudio"]!=null){
                window.external["playAudio"]( url ) ;
            }
        }

        public pauseAudio(url:string):void
        {
            if( window.external["pauseAudio"]!=null){
                window.external["pauseAudio"]( url ) ;
            }
        }

        public seekAudio(url:string):void
        {
            if( window.external["seekAudio"]!=null){
                window.external["seekAudio"]( url ) ;
            }
        }

        public stopAudio(url:string):void
        {
            if( window.external["stopAudio"]!=null){
                window.external["stopAudio"]( url ) ;
            }
        }

        public innerJump(name:string):void
        {
            if( window.external["innerJump"]!=null){
                window.external["innerJump"]( JSON.stringify({name:name}) ) ;
            }
        }

        public homeworkHTMLLoaded():void
        {
            if( window.external["homeworkHTMLLoaded"]!=null){
                window.external["homeworkHTMLLoaded"]( ) ;
            }
        }

        public localStorageSet( key:string, value:string ):void{
            if( window.external["localStorageSet"]!=null){
                var systemConfig:SystemConfig = ContextManager.context.getSystemConfig();
                var env:String = systemConfig.env ;
                var app:String = systemConfig.app ;
                window.external["localStorageSet"](JSON.stringify({
                    category: env + "." + app,
                    key:key,
                    value:value
                }))
            }
        }

        public localStorageGet( key:string ):void
        {
            var result:string ;
            if( window.external["localStorageGet"]!=null){
                var systemConfig:SystemConfig = ContextManager.context.getSystemConfig() ;
                var env:string = systemConfig.env ;
                var app:String = systemConfig.app ;
                var resultStr:string = window.external["localStorageGet"](JSON.stringify({
                    category: env + "." + app ,
                    key:key
                }))
                var valueObj:any = JSON.parse( resultStr ) ;
                if( valueObj.success ){
                    result = valueObj.value ;
                }else{
                    result = null ;
                }
                result = null ;
            }
            return null
        }

        public localStorageRemove( key:string ):void
        {
            if( window.external["localStorageRemove"]!=null){
                var cfg:SystemConfig = ContextManager.context.getSystemConfig();
                var env:string = cfg.env ;
                var app:string = cfg.app ;
                window.external["localStorageRemove"](JSON.stringify({
                    category: env + "." + app,
                    key:key
                }))
            }
        }

        public localStorageClear():void
        {
            if( window.external['localStorageClear'] != null ){
                var cfg:SystemConfig = ContextManager.context.getSystemConfig() ;
                var env:string = cfg.env ;
                var app:string = cfg.app ;
                window.external['localStorageClear'](JSON.stringify({
                    category:env + "." + app
                }))
            }
        }

        public getInitParams( refresh?: boolean ):void
        {
            if( this._initParams && !refresh ){
                return this._initParams;
            }
            this._initParams = URLUtils.getQueryParams( window.location.href ) ;
            return ( this._initParams || {} ) ;
        }

        public callExternal( funcName:string, ...paramsList:any[]):any{
            if( typeof window.external[funcName] === "function"){
                LogUtils.log(`[call external] ${funcName}, params: ${JSON.stringify(paramsList)}`) ;
                return window.external[funcName].apply( window.external, paramsList ) ;
            }else {
                LogUtils.log(`[no external] ${funcName}, params: ${JSON.stringify(paramsList)}`) ;
                return this._symbolExternalNotExist ;
            }
        }

        public updateTitle( str:string, txtColor?:number, bgColor?:number):void
        {
            document.title = str ;
        }

        public redirectToLogin( from:string ):void{
            from = from || "" ;
            this.callExternal( "redirectLogin", from ) ;
        }

        public getPlatform():Platform{
            return Platform.PC ;
        }

        public pageQueueNew( params:{url:string, name:string, orientation:string, initParam?:{[key:string]:string}}):void
        {
            if( window.external['pageQueueNew'] != null ){
                var temp:any = params ;
                if( temp.initParam != null ){
                    temp.initParam = JSONUtil.stringify( params.initParam ) ;
                }
                window.external['pageQueueNew'](JSON.stringify( temp) ) ;
            }
        }

        public pageQueueBack( params:{ name?:string, index?:number, step?:number, url?:string, initParams?:{[key:string]:string} }):void{
            if( window.external["pageQueueBack"] != null ){
                window.external["pageQueueBack"](JSON.stringify(params)) ;
            }
        }

        public pageQueueRefresh( params?:Object ):void{
            if( window.external["pageQueueRefresh"] != null ){
                window.external["pageQueueRefresh"](JSON.stringify( params ) ) ;
            }
        }

        public pageQueueQuit( params?:Object ):void{
            if( window.external["pageQueueQuit"] != null ){
                window.external["pageQueueQuit"](JSON.stringify( params ) ) ;
            }
        }

        public refreshData( ):void{
            if( window.external["refreshData"] != null ){
                window.external["refreshData"]( ) ;
            }
        }

        public showlog( msg:string ):void
        {

        }

        public log_b( data:{[name:string]:any}):void
        {

        }

        public payOrder( params:IPayOrderParams):void
        {
            this.callExternal("payOrder", JSON.stringify(params)) ;
        }

        public registerCallBackFunction( type:string, name:string ):void
        {
            this.callExternal( "registerCallBackFunction", JSON.stringify({
                type:type,
                name:name
            }))
        }



    }
}