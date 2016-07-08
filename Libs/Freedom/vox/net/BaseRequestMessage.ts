namespace vox.net{
    import BaseEvent = vox.events.BaseEvent;
    export class BaseRequestMessage extends BaseEvent{
        /**设置在这里的属性会在每一个消息中都当做参数传递给后台，且优先级最高*/
        public static __commonData:any = {} ;
        public __reloadTimes:number = 2 ;
        public __data:Object = null ;
        public __domain:string = null ;
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