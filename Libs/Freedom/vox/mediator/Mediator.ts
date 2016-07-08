namespace vox.mediator{
    import IDisposable = vox.intefaces.Disposable;
    import ApplicationContext = vox.context.ApplicationContext;
    import SystemConfig = vox.system.SystemConfig;
    import IEventHandler = vox.intefaces.IEventHandler;
    export interface Mediator extends IDisposable{

        /**获取上下文对象*/
        getContext():ApplicationContext;
        getExternal():External;
        getSystemConfig():SystemConfig;

        mapListener( target:Object, type:string, handler:IEventHandler):void;

        unmapListener( target:Object, type:string, hander:IEventHandler):void ;

        unmapListener():void ;

        show(data?:any):void ;

        close(data?:any):void ;
    }
}