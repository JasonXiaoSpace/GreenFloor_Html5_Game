namespace vox.context{
    import CommandClazz = vox.command.CommandClazz;
    import Mediator = vox.mediator.Mediator;
    import IResponseHandler = vox.intefaces.IResponseHandler;
    import IExternal = vox.external.IExternal;
    import ISystemConfig = vox.system.ISystemConfig;
    import SystemConfig = vox.system.SystemConfig;
    import ExplorerType = vox.enums.ExplorerType;
    import ExternalIOS = vox.external.ExternalIOS;
    import ExternalAndroid = vox.external.ExternalAndroid;
    import ExternalPC = vox.external.ExternalPC;
    import EnvCode = vox.system.EnvCode;
    import IEventHandler = vox.intefaces.IEventHandler;
    import EventUtil = vox.utils.EventUtil;
    import AppEvent = vox.events.AppEvent;

    interface IResponseData{
        handler:IResponseHandler ;
        once:boolean ;
    }

    export class ContextManager{
        /**静态获取ApplicationContext的方式*/
        public static context:ApplicationContext ;
    }

    export class ApplicationContext{

        public initRequestsComplete  :boolean = false ;

        private _queryParam          :Object;
        private _externalParam       :Object;
        private _initParam           :Object;
        private _dispatcher          :Object ;

        private _commondDict         :{[type:string]:CommandClazz[]} ;
        private _mediatorList        :Mediator[];
        private _singletonDict       :{[type:string]:any} = {} ;
        private _responseDatas       :{[type:string]:IResponseData} = {};
        private _applicationDict     :{[type:string]:Application} = {};
        private _defaultApplication  :Application ;

        private _external            :IExternal ;
        private _systemConfig        :SystemConfig ;
        private _explorerType        :ExplorerType ;
        private _explorerVersion     :string ;
        private _explorerBigVersion  :string ;

        //--------------getter方法--------------
        public getExternal():IExternal {
            return this._external ;
        }

        public getSystemConfig():SystemConfig{
            return this._systemConfig ;
        }

        public getApplication( type:string ):Application{
            return this._applicationDict[ type ] ;
        }

        public getDefaultApplcation():Application{
            return this._defaultApplication ;
        }

        public getInitParams():any
        {
            return this._initParam ;
        }

        public getExplorerType():ExplorerType{
            return this._explorerType ;
        }

        public getExplorerVersion():string{
            return this._explorerVersion ;
        }

        public getExplorerBigVersion():string{
            return this._explorerBigVersion ;
        }

        public constructor()
        {

        }

        public initilize():void
        {
            //初始化浏览器数据
            this.initExplorer() ;

            //初始化Query数据
            this.initQueryParams() ;

            //初始化外部数据
            this.initExternalParams() ;

            //初始外外壳接口
            this.initExternal() ;

            //初始化系统配置
            this.initSystemConfig() ;

            //监听GetServerResponse事件
            //TODO

        }

        /**初始化浏览器类型 版本号 大版本号 肖建军@2016-06-28*/
        public initExplorer():void
        {
            //取得浏览器的userAgent字符串
            var userAgent:string = navigator.userAgent ;
            //判断浏览器类型
            var regExp:RegExp ;
            var result:RegExpExecArray ;
            if( window["ActiveObject"] !== null ){
                this._explorerType = ExplorerType.IE ;
                //获取IE版本号
                regExp = new RegExp("MSIE ([^ ; \\)]+);");
                if( result === null ){
                    regExp = new RegExp("rv:([^ ; \\)]+");
                }
            }else if( userAgent.indexOf("Edge") > -1 ){
                //Edge浏览器
                this._explorerType = ExplorerType.Edge ;
                regExp = new RegExp("Edge/([^ ; \\)]+)");
            }else if (userAgent.indexOf("Firefox") > -1) {
                // Firefox浏览器
                this._explorerType = vox.enums.ExplorerType.Firefox;
                // 获取Firefox版本号
                regExp = new RegExp("Firefox/([^ ;\\)]+)");
            }else if (userAgent.indexOf("Opera") > -1) {
                // Opera浏览器
                this._explorerType = vox.enums.ExplorerType.Opera;
                // 获取Opera版本号
                regExp = new RegExp("OPR/([^ ;\\)]+)");
            }else if (userAgent.indexOf("Chrome") > -1){
                // Chrome浏览器
                this._explorerType = vox.enums.ExplorerType.Chrome;
                // 获取Crhome版本号
                regExp = new RegExp("Chrome/([^ ;\\)]+)");
            }else if (userAgent.indexOf("Safari") > -1) {
                // Safari浏览器
                this._explorerType = vox.enums.ExplorerType.Safari;
                // 获取Safari版本号
                regExp = new RegExp("Safari/([^ ;\\)]+)");
            }else{
                // 其他浏览器
                this._explorerType = vox.enums.ExplorerType.Others;
            }

            if( regExp != null ){
                result = regExp.exec( userAgent ) ;
                this._explorerVersion = result[1];
            }else{
                this._explorerVersion = "0.0";
            }

            this._explorerBigVersion = this._explorerVersion.split(".")[0] ;
        }

        /**初始化query参数，是在href？后面的*/
        private initQueryParams():void{
            this._queryParam = { } ;
            var loc:string = window.location.href ;
            var query:string = loc.substring( loc.search(/\?/) + 1 ) ; //拿到问号后的字符串
            var vars:string[] = query.split("&") ;
            for( var i:number = 0, len:number = vars.length ; i < len ; i ++ ){
                var pair:string[] = vars[i].split("=", 2);
                if( pair.length != 2 || !pair[0] ) continue ;
                var key:string = pair[0];
                var value:string = pair[1];
                key = decodeURIComponent( key ) ;
                value = decodeURIComponent( value ) ;
                //decode twice for ios
                key = decodeURIComponent( key ) ;
                value = decodeURIComponent( value ) ;
                this._queryParam[ key ] = value ;
            }
        }

        /**初始化external的参数*/
        private initExternalParams():void
        {
            //处理 window.external
            try{
                if( !(typeof window.external !== "Object") || !window.external ){
                    window.external = { } ;
                }
            }catch(err){
                window.external = { } ;
            }
            this._externalParam = window.external ;
        }

        private initExternal():void
        {
            if( /iPhone|iPad|iPod|iOS/i.test( navigator.userAgent )){
                this._external = new ExternalIOS();
            }else if( /Android/i.test( navigator.userAgent )){
                this._external = new ExternalAndroid() ;
            }else{
                this._external = new ExternalPC();
            }
        }

        private initSystemConfig():void{
            this._systemConfig = new SystemConfig();
            this._initParam = this._external.getInitParam() ;//从location.href 和 callExternal两个地方拿到的
            if( this._initParam.server_type != null ) {
                this._systemConfig.env = this._initParam.server_type ;
                this._systemConfig.envCode = EnvCode[this._systemConfig.env ] ;
            }

            /**提供可能的env2domain的转换表，不提供则会使用initParams中的domain*/
            var domainTransform:{[env:string]:string} = this._defaultApplication.getDomainTransform() ;
            if( domainTransform != null ){
                this._systemConfig.domain = domainTransform[this._systemConfig.env ] ;
            }
            if( this._systemConfig.domain == null && this._initParam.domain!= null ){
                this._systemConfig.domain = this._initParam.domain ;
            }
            //设置主站domain
            if( this._initParam.domain != null ){
                this._systemConfig.mainDomain = this._initParam.domain ;
            }
            if( this._initParam.img_domain != null ){
                this._systemConfig.imgDomain = this._initParam.img_domain ;
            }
            if( this._initParam.native_version != null ){
                this._systemConfig.nativeVersion = this._initParam.native_version ;
            }
            if( this._initParam.client_type != null ){
                this._systemConfig.clientType = this._initParam.client_type ;
            }
            if( this._initParam.client_name != null ){
                this._systemConfig.clientName = this._initParam.client_name ;
            }
            if( this._initParam.uuid != null ){
                this._systemConfig.uuid = this._initParam.uuid ;
            }
            if( this._initParam.user_id != null ){
                this._systemConfig.userId = this._initParam.user_id ;
            }
            if( this._initParam.session_key != null ){
                this._systemConfig.sessionKey = this._initParam.session_key ;
            }
            if( this._initParam.ktwelve != null ){
                this._systemConfig.ktwelve = this._initParam.ktwelve ;
            }

            this._systemConfig.app =  this._defaultApplication.getAppName() ;
            this._systemConfig.compileVersion = this._defaultApplication.getCompileVersion() ;
            this._systemConfig.htmlVersion = this._defaultApplication.getHtmlVersion() ;

            //如果是dev环境，则使用testInitParams替换当前配置
            if( this._systemConfig.envCode === EnvCode.dev ){
                var testInitParams:ISystemConfig = this._defaultApplication.testInitParams() ;//取testFlashvars
                for( var key in testInitParams ){
                    if( testInitParams[key]!=null){
                        this._systemConfig[key] = testInitParams[key] ;
                    }
                }
            }
        }

        public addListener( type:string, handler:IEventHandler):void
        {
            EventUtil.addEventListener( this._dispatcher, type, handler ) ;
        }

        public removeListener( type:string, handler:IEventHandler):void{
            EventUtil.removeEventHandler( this._dispatcher, type, handler ) ;
        }

        /**监听消息协议返回*/

    }
}