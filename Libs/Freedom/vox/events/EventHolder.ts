namespace vox.events
{
    import IEventHandler = vox.intefaces.IEventHandler;
    import IEventHandler = vox.intefaces.IEventHandler;
    import EventUtil = vox.utils.EventUtil;
    import EventUtil = vox.utils.EventUtil;
    class EventMapper
    {
        public target:Object ;
        public type:string;
        public handler:IEventHandler;

        public constructor( target:Object, type:string, handler:IEventHandler){
            this.target = target ;
            this.type = type ;
            this.handler = handler ;
        }
    }

    export class EventHolder
    {
        private _eventMappers:EventMapper[] ;

        public constructor()
        {
            this._eventMappers = [] ;
        }

        public getEventMapper( target:Object, type:string, handler:IEventHandler, remove:boolean = false ):EventMapper{
            var targetMapper:EventMapper = null ;
            for( var i in this._eventMappers ){
                var mapper:EventMapper = this._eventMappers[ i ] ;
                if( mapper.target == target && mapper.type == type && mapper.handler == handler ){
                    targetMapper = mapper ;
                    //如果需要移除，则移除
                    if( remove ){
                        this._eventMappers.splice( parseInt(i), 1 ) ;
                    }
                    break;
                }
            }
            return targetMapper ;
        }

        public mapListener( target:Object, type:string, handler:IEventHandler):void
        {
            if( target != null && type!= null && type != ""){
                //进行唯一性判断
                var mapper:EventMapper = this.getEventMapper( target, type, handler ) ;
                if( mapper != null ) return ;
                //需要添加监听，先注册监听
                EventUtil.addEventListener( target, type, handler );
                this._eventMappers.push( new EventMapper(target, type, handler));
            }
        }

        public unmapListener( target:Object, type:string, handler:IEventHandler):void
        {
            //获取的同时移除记录
            var mapper:EventMapper = this.getEventMapper( target, type, handler, true );
            if( mapper == null ) return ;
            //移除事件
            EventUtil.removeEventHandler( target, type, handler );
        }

        /**移除所有事件的监听*/
        public unmapListeners():void{
            for( var i :number = 0, len:number = this._eventMappers.length ; i < len ; i ++){
                var mapper:EventMapper = this._eventMappers.shift() ;
                EventUtil.removeEventHandler( mapper.target, mapper.type, mapper.handler ) ;
            }
        }


    }
}