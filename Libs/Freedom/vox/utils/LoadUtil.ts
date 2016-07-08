/// <reference path="../../../ThirdParty/jquery.d.ts"/>
namespace vox.utils{
    import ErrorCode = vox.enums.ErrorCode;
    import ChainError = vox.global.ChainError;
    export enum Method{
        Get = 1,
        Head,
        Post,
        Put,
        Delete,
        Connect,
        Options,
        Trace
    }

    export enum ContentType{
        Form = 1,
        Json
    }

    const ContentTypeMap:{[key:number]:string} = {
        [ContentType.Form]:"application/x-www-form-urlencoded",
        [ContentType.Json]:"application/json"
    }

    interface ILoadSettings{
        method?:Method,
        timeout?:number,
        reloadTimes?:number,
        contentType?:ContentType,
        data?:any,
        dataFilter?:( data:any, ty:any) => any ,
        onSuccess?:( data:any) => any ,
        onError?:( err:ChainError ) => any ,
        onComplete?:()=>any,
        sync?:boolean,
        proxy?:boolean,
        dataType?: string,
    }

    export class LoadUtil{
        private name:string ;
        private url:string;
        private setting:ILoadSettings;
        private reloadTimes:number = 0 ;
        private dataStr:string = "";
        private responseData:any ;
        private responseType:any ;
        public externalLoadFunc:( data:any )=> void ;

        constructor( name:string){
            this.name = name ;
        }

        static commonSettings:ILoadSettings = {
            method:Method.Get,
            timeout: 10000,
            reloadTimes:2,
            contentType:ContentType.Form,
            dataType:'text',
            sync: false,
            proxy: false
        }

        public load( url:string, setting:ILoadSettings):void
        {
            LogUtils.log(`[Service] 发送请求: ${ url }`) ;
            this.setting = setting ;

            //补齐通用设置
            for( var key in LoadUtil.commonSettings ){
                if( !setting.hasOwnProperty(key)){
                    setting[key] = LoadUtil.commonSettings[key];
                }
            }

            if( !url ){
                LogUtils.log(`[Service] url错误: ${ url }`) ;
                if( setting.onError ){
                    setting.onError( new ChainError(`Invalid url: ${url}`, ErrorCode.HTTP_REQUEST_ERROR)) ;
                    return ;
                }
            }

            this.url = url ;
            this.dataStr = "";
            if( typeof setting.data == "object"){
                if( setting.data ){
                    if( setting.method == Method.Post && setting.contentType == ContentType.Json ){
                        try{
                            this.dataStr = JSONUtil.stringify( setting.data ) ;
                        }catch(error){
                            LogUtils.log( error, LogLevel.Err ) ;
                            if( setting.onError ){
                                setting.onError( new ChainError("json序列化错误", ErrorCode.JSON_STRINGIFY_ERROR, error )) ;
                                return ;
                            }
                        }
                    }else{
                       this.dataStr = $.param( setting.data ) ;
                    }
                }
            }else{
               if( setting.data ){
                   this.dataStr = setting.data.toString() ;
               }
            }

            var userData:any ={} ;
            userData._lv = LogLevel.Info ;
            userData.module = "serive" ;
            userData.op = "request_start" ;
            var etcData:any={};
            etcData.name = this.name ;
            etcData.url = this.url ;
            etcData.proxy = setting.proxy;
            etcData.method = Method[setting.method];
            etcData.contentType = setting.contentType ;
            etcData.dataType = setting.dataType ;
            etcData.retryTimes = setting.reloadTimes ;
            LogUtils.remoteLog( userData, etcData ) ;

            this.reloadTimes = 0 ;
            this.send();
        }

        private send():void{
            if( this.setting.proxy && this.externalLoadFunc ){
                this.externalLoadFunc( this ) ;
            }else{
                $.ajax(this.url,{
                    context: this,
                    url: this.url,
                    type: Method[this.setting.method],
                    timeout:this.setting.timeout,
                    dataFilter:this.setting.dataFilter,
                    success:this.onSuccess,
                    error:this.onError,
                    complete:this.onComplete,
                    contentType: ContentTypeMap[this.setting.contentType],
                    data: this.dataStr,
                    async: !this.setting.sync
                })
            }
        }

        private onSuccess( data:any, textStatus:string, jqXHR:JQueryXHR):void{
            LogUtils.log(`[Service] success: ${this.url}` ) ;
            if( this.setting.onSuccess ){
                this.setting.onSuccess( data ) ;
            }
        }

        private onError( jqXHR:JQueryXHR, txtStatus:string, errThrown:string):void{
            LogUtils.log(`[Service] error: ${errThrown}`, LogLevel.Err);

            if( txtStatus == "abort"){
                return ;
            }

            var errCode:string;
            if( txtStatus == "parseerror"){
                errCode = ErrorCode.JSON_PARSE_ERROR;
            }else if( txtStatus == "timeout"){
                errCode = ErrorCode.HTTP_REQUEST_TIMEOUT;
            }else{
                errCode = ErrorCode.HTTP_REQUEST_ERROR;
            }

            //记录日志
            var info:any = {
                name:this.name,
                url:this.url,
                textStatus:txtStatus||"",
                errorThrown:errThrown?errThrown.toString():"",
                method:this.setting.method,
                requestType:ContentTypeMap[this.setting.contentType],
                requestData:this.setting.data,
                dataType:this.setting.dataType,
                responseType:this.responseType,
                responseData:this.responseData,
                retryTimes:this.reloadTimes,
                location:window.location
            };

            if( this.setting.proxy ){
                info.proxy = true ;
            }else{
                if( jqXHR ){
                    info.readyState = jqXHR.readyState ;
                    info.status = jqXHR.status ;
                }
            }

            LogUtils.remoteLog({
                _lv:LogLevel.Err,
                module:"service",
                op:"request_error",
                err_code: errCode
            }, info ) ;

            //还有重试次数的话先重试
            if( this.reloadTimes < this.setting.reloadTimes ){
                this.reloadTimes ++ ;
                LogUtils.log(`[Service] 请求失败，进行重试(第${this.reloadTimes}次，剩余${this.setting.reloadTimes - this.reloadTimes}次)，url=${this.url}`) ;
                var self:LoadUtil = this ;
                var flag:number = setTimeout( function(){
                    clearTimeout( flag ) ;
                    self.send();
                }, 150 );
            }else if( this.setting.onError ){
                this.setting.onError( new ChainError(errThrown?errThrown.toString():txtStatus, errCode));
            }
        }

        private onComplete( jqXHR:JQueryXHR, txtStatus:string):void{
            if( this.setting.onComplete ){
                this.setting.onComplete();
            }
        }

        private dataFilter( data:any, type:any):any{
            this.responseData = data ;
            this.responseType = type ;
            if( this.setting.dataFilter ) {
                data = this.setting.dataFilter(data, type);
            }
            return data ;
        }
    }
}