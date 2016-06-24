namespace vox.net{
    import BaseEvent = vox.events.BaseEvent;
    export class BaseRequestMessage extends BaseEvent{
        public __reloadTimes:number = 2 ;
        public __data:Object = null ;
        public __userData:any = {};
        public __url():string{
            return null ;
        }
        public __useGet():Boolean{
            return false ;
        }
        public constructor(type:string){
            super(type,<EventInit>{bubbles:false,cancelable:false});
        }
    }
}