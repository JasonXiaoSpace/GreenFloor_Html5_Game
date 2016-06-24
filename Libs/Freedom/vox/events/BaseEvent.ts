namespace vox.events
{
    export class BaseEvent implements Event {

        public Target_Phase:number;
        public Bubbling_Phase:number;
        public Capturing_Phase:number;
        public eventPhase:number;
        public timeStamp:number;

        public defaultPrevented:boolean;
        public bubbles:boolean;
        public cancelBubble:boolean;
        public cancelable:boolean;
        public isTrusted:boolean;
        public returnValue:boolean;

        public currentTarget:EventTarget;
        public target:EventTarget;

        public srcElement:Element;

        public type:string;

        public constructor(type:string, eventInitDict?:EventInit) {
            this.type = type;
            if (eventInitDict != null) {
                this.bubbles = eventInitDict.bubbles;
                this.cancelable = eventInitDict.cancelable;
            }
        }

        public initEvent(eventTypeArg:string, canBubbleArg:boolean, cancelableArg:boolean):void {
            this.type = eventTypeArg;
            this.cancelBubble = canBubbleArg;
            this.cancelable = cancelableArg;
        }

        public preventDefault():void {

        }

        public stopImmediatePropagation():void {

        }

        public stopPropagation():void
        {

        }
    }
}