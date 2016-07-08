namespace vox.utils.statemachine{
    export class StateMachine{
        private _states           :State[] = [];
        private _context          :StateContext ;

        private _running          :boolean = false ;
        private _pause            :boolean = false ;
        public autoRun            :boolean = false ;

        private _pauseData        :any = null;
        private _tempUserData     :{[key:string]:any} = {};

        public getRunning():boolean{
            return this._running ;
        }

        public getUserData():{[key:string]:any}{
            return this._context.getUserData();
        }

        public add( state:State, ...more:State[]):number{
            more.unshift( state ) ;
            for( var i:number=0, len:number=more.length; i<len ;i++ ){
                var tmp:State = more[i];
                if( tmp != null ){
                    this._states.push( tmp ) ;
                    tmp.onAdd( this._context ) ;
                }
            }
            if( this._pause && this.autoRun ){
                this.resume();
            }
            return this._states.length ;
        }

        public shift( state?:State):State{
            if( this._states.length == 0 ) return null ;
            var stateExit:State = this._states[0];
            if( state!=null && stateExit!=state ) return null ;
            var data:any = stateExit.onExit( this._context ) ;
            stateExit.onRemove( this._context ) ;
            this._states.shift() ;

            if( this._pause ){
                this._pauseData = data ;
            }else if( this._states.length == 0 ){
                this.pause();
            }
        }

        public pass( forceFinish:boolean ):State{
            if( this._states.length == 0 ) return null ;
            var state:State = this._states[ 0 ] ;
            var manualDelete:boolean = state.onPass( this._context, forceFinish ) ;
            if( !manualDelete ) this.shift( state ) ;
            return state ;
        }

        /**启动状态机*/
        public start():void{

        }



    }
}