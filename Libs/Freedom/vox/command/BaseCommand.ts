namespace vox.command{
    import Executable = vox.intefaces.Executable;
    import ApplicationContext = vox.context.ApplicationContext;
    import External = vox.external.External;
    import SystemConfig = vox.system.SystemConfig;
    import IEventHandler = vox.intefaces.IEventHandler;
    export class BaseCommand implements Executable{

        /**应用程序上下文对象*/
        public context:ApplicationContext;
        /**应用程序外壳接口*/
        public external:External;
        /**应用程序系统配置*/
        public systemConfig:SystemConfig ;
        /**事件类型*/
        public type:string ;
        /**事件参数数组*/
        public parameters:any[] ;

        public constructor(){

        }

        /**派发事件到公共事件派发器
         * @param type 事件类型
         * @param args 可携带的事件参数*/
        protected dispatch( type:string, ...args ) :void ;

        /**派发事件到公共事件派发器
         * @param event 事件对象*/
        protected dispatch( event:Event ):void ;

        protected dispatch( typeOrEvent:any, ...args):void
        {
            args.unshift( typeOrEvent ) ;
            this.context.dispatch.apply( this.context, args ) ;
        }

        protected listen( type:string, handler:IEventHandler):void
        {
            this.context.addListener( type, handler);
        }

        protected unlisten( type:string, handler:IEventHandler):void
        {
            this.context.removeListener(type,handler) ;
        }

        public exec():void
        {

        }
    }
}