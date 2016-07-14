/// <reference path="StateMachine.ts"/>
/// <reference path="State.ts"/>

namespace vox.utils.statemachine
{
	/**
	 * 功能: 状态机一个生命周期内的上下文
	 * <br>
	 * 版权: ©Raykid
	 * <br>
	 * 作者: Raykid
	 */
	export class StateContext
	{
		private _userData:{[key:string]:any} = {};
		private _stateMachine:StateMachine;
		
		/** 获取或设置是否跳过剩余可跳过的状态 */
		public skip:boolean = false;
		
		/** 在一个状态机生命周期中可以保存任意数据，状态机生命周期结束后将被销毁 */
		public getUserData():{[key:string]:any} {return this._userData;}
		/** 获取或设置状态机自动运行状态 */
		public getAutoRun():boolean {return this._stateMachine.autoRun;}
		public setAutoRun(value:boolean):void {this._stateMachine.autoRun = value;}
		
		public constructor(stateMachine:StateMachine)
		{
			this._stateMachine = stateMachine;
		}
		
		/**
		 * 添加一个或多个状态到当前状态机，该方法为状态提供在运行时动态增加状态机状态的机会
		 * @param state 要添加的状态
		 * @param more 可能要添加的更多状态
		 * @return 返回当前状态数量
		 */		
		public addState(state:State, ...more:State[]):number
        {
			more.unshift(state);
			//添加state到状态机的_states里面, 并且把_context置给state, 返回_states长度
			return this._stateMachine.add.apply(this._stateMachine, more);
		}
		
		/**
		 * 当需要结束状态时调用该方法即可
		 * @param state 要结束的状态，必须与当前状态吻合才会奏效。如果传递null则默认是结束当前状态（慎用）
		 */		
		public finish(state?:State):void
        {
			// 之所以要用setTimeout，是因为防止堆栈溢出
			setTimeout(this._stateMachine.shift, 0, state);
		}
		
		/** 清理状态机上下文对象 */
		public clear():void
        {
			for(var key in this._userData)
            {
				delete this._userData[key];
			}
		}
	}
}