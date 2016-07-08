namespace vox.net{
    import BaseCommand = vox.command.BaseCommand;
    import MaskUtil = vox.utils.MaskUtil;
    import AppEvent = vox.events.AppEvent;
    import ChainError = vox.global.ChainError;
    import MaskUtil = vox.utils.MaskUtil;
    import SystemConfig = vox.system.SystemConfig;
    import URLUtils = vox.utils.URLUtils;
    import ObjectUtil = vox.utils.ObjectUtil;
    export class BaseRequestCommand extends BaseCommand{

        public getMessage():BaseRequestMessage{
            return this.parameters[0] as BaseRequestMessage ;
        }

        private onSuccess(data:any):void
        {
            var response:BaseMessageType = this.parseResponse( data ) ;
            MaskUtil.hideLoading() ;
            //发送返回事件
            this.dispatch( AppEvent.Evt_Get_Server_Response, response, this.getMessage() ) ;
        }

        private onError( err:ChainError ):void{
            MaskUtil.hideLoading() ;
            //发送错误事件
            this.dispatch( AppEvent.Evt_Request_ErrorEvent, error, this.getMessage() ) ;
        }

        public parseResponse( result:Object):BaseMessageType{
            return null ;
        }

        private trimData(data):Object{
            for( var key in data ){
                if( data[key] == null ){
                    delete data[key] ;
                }
            }
            return data ;
        }

        public exec():void{
            var msg:BaseRequestMessage = this.getMessage() ;
            if( msg == null ) throw new Error("绑定的消息必须实现IRequestMessage接口")

            //判断是否有domain ，没有就什么都不做s
            var cfg:SystemConfig = this.context.getSystemConfig() ;
            if( cfg.domain == null ) return ;

            //添加遮罩
            MaskUtil.showLoading() ;

            //发送消息
            var url:string = msg.__url() ;
            var domain:string = msg.__domain ;
            if( domain != null ) url = URLUtils.wrapHost( url, domain, true ) ;

            //指定消息参数连接上公共参数作为参数
            var data:Object = ObjectUtil.extendObject( msg.__data, BaseRequestMessage.__commonData) ;

        }
   }
}