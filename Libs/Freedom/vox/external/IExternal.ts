namespace vox.external{
    import Platform = vox.enums.Platform;
    export interface IExternal
    {
        loadAudio( url:string ):void ;
        playAudio( url:string ):void ;
        pauseAudio( url:string ):void ;
        seekAudio( url:string, time:number ):void ;
        stopAudio( url:string ):void ;

        /**跳转到内部应用*/
        innerJump( name:string ):void ;

        /**h5加载完成 通知native*/
        homeworkHTMLLoaded():void;

        localStorageSet( key:string, value:string ):void;
        localStorageGet( key:string ):string ;
        localStorageRemove( key:string ):void ;
        localStorageClear():void ;

        getPlatform():Platform ;

        /**调用外部扩展之前检查下*/
        callExternal( funName:string, ... paramList:any[]):any ;

        /**更新Title*/
        updateTitle( str:string, txtColor?:number, bgColor?:number):void

        /**重定向到登录界面*/
        redirectToLogin( from:string ):void ;

        getInitParam( refresh?: boolean):any ;

        /**页面对列 打开新页面*/
        pageQueueNew( params:{url:string, name:string, orientation?:string, initParam?:{[key:string]:string}}):void ;
        /**页面对列 后退
         * 优先级 name > index > step(正常情况下三都互斥)
         * 如果没有index也没有name(或找不到指定name)，则后退一步
         * 后退后 队列中在目标页面之后的全部清除
         * @param step int 后退的步数
         * @param index int 目标页面的索引
         * @param name string 目标页面的名称
         * @param url string 如果传入了，则目标页面要加载这个新的url
         * @param initParam Object 附加参数，目标页面中调用getInitParams()的时候需要返回的值*/
        pageQueueBack( params:{name?:string, index?:number, step?:number, url?:string, initPamams?:{[key:string]:string}}):void;

        /**页面队列-刷新
         * 保留
         * 暂时没有想到应用场景，页面自己直接reload就行了*/
        pageQueueRefresh( params?:Object ):void ;

        /**页面队列退出
         * 直接退出整个队列，相当于在root页面后退*/
        pageQuereQuit( params?:Object ):void ;

        /**刷新页面数据*/
        refreshData():void;

        /**显示本地日志*/
        showLog(msg:string):void ;

        /**发送统计日志*/
        log_b( data:{[name:string]:any}):void ;

        /**支付接口*/
        payOrder( param:IPayOrderParams):void ;

        /**注册回调方法
         * @param type 回调类型
         * @param name 回调函数名*/
        registerCallbackFunction( type:string, name:string):void ;

        /**注销回调方法
         * @param type 回调类型
         * @param name 回调函数名*/
        unregisterCallbackFunction( type:string, name:string):void ;

    }

    export interface IPayOrderParams{
        /**支付类型 1代表微信支付 2代表支付宝支付*/
        orderType:number,
        /**支付需要的参数*/
        data:any,
        /**支付回调的方法名*/
        handler:string
    }

    export interface IPayOrderHandlerParams{
        /**支付类型*/
        orderType:number ,
        /**具体查看各个支付平台的code*/
        code:number ,
        /**说明*/
        msg:string
    }

    export enum OSType{
        IOS,
        Android,
        PC
    }

}