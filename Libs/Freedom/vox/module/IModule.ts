namespace vox.module{
    import IDisposable = vox.intefaces.IDisposable;
    export interface IModule extends IDisposable{

        __initialize():void;
        getName():string;
        getNameForShow():string;
        show(data?:any):void;
        close(data?:any):void;
        onActivate( moduleFrom:IModule, data?:any):void;
        /**设置显示回调，仅是框架内部使用*/
        setShowHandler( handler:()=>void);
        /**设置关闭回调，仅是框架内部使用*/
        setCloseHandler( handler:()=>void);
    }

    export interface IModuleClass{
        new (...args:any[]):IModule ;
    }
}