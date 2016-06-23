namespace vox.utils
{
    export class EventUtil
    {
        public static dispatchEvent( target:Object, type:string, ...args ):void
        {
            $(target).trigger( type, args ) ;
        }

        public static addEventListener( target:Object, type:string, handler:vox.intefaces.EventHandler):void
        {
            if( target != null && type != null && type != "")
            {
                $(target).on(type,handler) ;
            }
        }

        public static removeEventHandler( target:Object, type:string, handler:vox.intefaces.EventHandler):void
        {
            if( target != null && type != null && type != "")
            {
                $( target ).off( type, handler )
            }
        }
    }
}