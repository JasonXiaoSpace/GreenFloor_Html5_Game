namespace vox.utils{

    export enum LogLevel{
        Debug,
        Info,
        Notice,
        Warning,
        Err,
        Crit,
        Alert,
        Emeg
    }

    interface ILogBaseData{
        _lv?:LogLevel,
        app?:string,
        html_version?:string,
        native_verstion?:string,
        user_agent?:string,
        module?:string,
        op?:string,
        msg?:string,
        uuid?:string,
        userId?:string,
        server_type?:string,
        err_code?: string          // 错误码
    }

    export class LogUtils{
        /**基础字段*/
        public static commonBaseData:ILogBaseData = {} ;

        /**扩展字段*/
        public static commonEtcData:any = { };

        /**log级别限制，低于此级别的log不会显示，其实级别越高，危险越高*/
        public static maxLogLevel:LogLevel = LogLevel.Debug ;

        /**Pingback级别限制，低于此级别的log不会发送，其实级别越高，危险越高*/
        public static maxPingbackLevel:LogLevel = LogLevel.Debug ;

        /**本地日志
         * @param msg
         * @param level*/
        public static log( msg:string, level:number = LogLevel.Debug ):void{
            if( !(level>=0)) level = LogLevel.Debug ; //如果没有输入level，则默认为最低级别的 Log
            if( level < LogUtils.maxLogLevel ) return ; //如果不够危险，即低于 maxLogLevel 则不记录日志
            if( msg === null || msg === undefined ) msg = "";
            msg = LogLevel[level] + "" + new Date().toLocaleString() + msg ;
            //for console
            if( (typeof console) !== "undefinded" && console ){
                if( console.error && level >= LogLevel.Err ){
                    console.error( msg ) ;
                }else{
                    console.log( msg ) ;
                }
            }

            //for external




        }

        public static remoteLog( userBaseData:ILogBaseData, userEtcData:any):void{

        }
    }
}