namespace vox.utils.statemachine{
    export class StateContext
    {
        private _userData              :{[key:string]:any} = {};
        private _stateMachine          :StateMachine ;
        /**获取或设置是否跳过剩余可跳过的状态*/
        public skip                    :boolean = false ;

        /**在一个状态机生命周期中可以保存任意数据，状态机生命周期结束后将被销毁*/
        public getUserData():{[key:string]:any}{
            return this._userData ;
        }

        /**获取或调协状态机自动运行状态*/
        public getAutoRun():boolean{
            return this._stateMachine.autoRun ;
        }

        public setAutoRun( value:boolean ):void{
            this._stateMachine.autoRun = value ;
        }

        public constructor( stateMachine:StateMachine )
        {
            this._stateMachine = stateMachine ;
        }

        /**添加一个或多个状态到当前状态机，该方法为状态提供在运行时动态增加机状态的机会
         * @param state 要添加的状态
         * @param more 可能要添加的更多状态
         * @param 返回当前状态的数据*/
        public addState( state:State, ...more:State[]):number{
            more.unshift( state ) ;
            return this._stateMachine.add.apply( this._stateMachine, more ) ;
        }

        /**当需要结束状态时调用该方法即可
         * @param state 要结束的状态，必须与当前状态吻合才会奏效，如果传递null, 则默认是结束当前状态(慎用)*/
        public finish( state?:State ):void{
            setTimeout( this._stateMachine.shift, 0, state ) ;
        }

        public clear():void{
            for( var key in this._userData ){
                delete this._userData[ key ] ;
            }
        }
    }
}