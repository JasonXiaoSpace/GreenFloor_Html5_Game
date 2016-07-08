namespace vox.utils.statemachine.states{
    export class FunctionState implements State{
        private _callback:(...args:any[])=>any ;

        private _thisArg:any ;

        private _args:any[];

        private _returnValue:any ;

        public skippable():boolean{
            return true ;
        }

        public constructor( callback:(...args:any[])=>any, thisArg?:any, ...args:any[]){
            this._callback = callback ;
            this._thisArg = thisArg ;
            this._args = args ;
        }

        public onAdd( context:StateContext ):void
        {

        }

        public onEnter( context:StateContext, data:any):void
        {
            if( this._callback != null ){
                var args:any[] = [context].concat( this._args ) ;
                this._returnValue = this._callback.apply( this._thisArg, args ) ;
            }
            context.finish( this ) ;
        }

        public onUpdate( context:StateMachine, delta:number):void
        {

        }

        public onPass( context:StateContext, forceFinish:boolean):boolean{
            return false ;
        }

        public onExit( context:StateContext ):any{
            return this._returnValue ;
        }

        public onRemove( context:StateContext ):void
        {
            this._returnValue = null ;
        }
    }
}