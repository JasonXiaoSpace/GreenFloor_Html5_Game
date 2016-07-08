namespace vox.manager{
    import ApplicationContext = vox.context.ApplicationContext;
    import ContextManager = vox.context.ContextManager ;
    import IExternal = vox.external.IExternal ;
    export class ExternalEventManager{
        private static _listeners:{[type:string]:Function[]} = {};

        public static initialize():void{
            var external:IExternal = ContextManager.context.getExternal() ;
            external.registerCallbackFunction("playcallback","vox.manager.ExternalEventManager.playcallback") ;
            external.registerCallbackFunction("pauseActivity","vox.manager.ExternalEventManager.pauseActivity") ;
        }

        private static playcallback( ...args:any[] ):void{
            ExternalEventManager.trigger( "playcallback", args ) ;
        }

        private static pauseActivity( ...args:any[] ):void{
            ExternalEventManager.trigger("pauseActivity", args ) ;
        }

        private static trigger( type:string, args:any[] ):void{
            var handlers:Function[] = ExternalEventManager._listeners[type];
            for( var i in handlers ){
                var handler:Function = handler[i];
                if( handler!=null){
                    handler.apply(null, args);
                }
            }
        }

        public static register( type:string, handler:Function):void
        {
            var handlers:Function[] = ExternalEventManager._listeners[ type ] ;
            if( handlers == null ){
                ExternalEventManager._listeners[ type ] = []; //TODO这里可能有问题 肖建军
            }
            if( handlers.indexOf(handler) < 0 ){
                handlers.push( handler ) ;
            }
        }

        public static unregister( type:string, handler:Function):void
        {
            var handlers:Function[] = ExternalEventManager._listeners[type];
            if( handlers == null ) return ;
            var index:number = handlers.indexOf( handler ) ;
            if( index > 0 ){
                handlers.splice( index, 1 ) ;
            }
        }
    }
}