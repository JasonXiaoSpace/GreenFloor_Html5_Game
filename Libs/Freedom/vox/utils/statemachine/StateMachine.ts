/// <reference path="StateContext.ts"/>
/// <reference path="State.ts"/>

namespace vox.utils.statemachine
{
	/**
	 * 功能: 状态机
	 * <br>
	 * 版权: ©Raykid
	 * <br>
	 * 作者: Raykid
	 */
	export class StateMachine
	{
		private _states:State[] = [];
		private _context:StateContext;
		private _running:boolean = false;
		private _pause:boolean = false;
		private _pauseData:any = null;
		private _tempUserData:{[key:string]:any} = {};
		
		/** 是否在添加状态时自动立即运行状态机，默认为false */
		public autoRun:boolean = false;
		
		/** 获取状态机当前是否正在运行 */
		public getRunning():boolean
		{
			return this._running;
		}
		
		/** 获取用户数据，可以修改其中的值，这些值在状态机一次生命周期中会一直奏效 */
		public getUserData():{[key:string]:any}
		{
			return this._context.getUserData();
		}
		
		public constructor()
		{
            this._context = new StateContext(this);
		}
		
		private onUpdate(delta:number):void
		{
			// 调用当前状态的onUpdate方法，并把毫秒间隔传递过去
            this._states[0].onUpdate(this._context, delta);
		}
		
		public addUserData(key:string, value:any):void
		{
			if(this._context != null) this._context.getUserData()[key] = value;
			else this._tempUserData[key] = value;
		}
		
		/**
		 * 添加一个或多个状态
		 * @param state 要添加的状态
		 * @param more 可能要添加的更多状态
		 * @return 返回当前状态数量
		 */		
		public add(state:State, ...more:State[]):number
		{
			more.unshift(state);
			for(var i:number = 0, len:number = more.length; i < len; i++)
            {
				var temp:State = more[i];
				if(temp != null)
                {
                    this._states.push(temp);//添加state到_states里
					temp.onAdd(this._context);//把context添加给state
				}
			}
			if(this._pause && this.autoRun) this.resume(); //如果当前是暂停的，且是自己开始的，则一添加就自动开始
			return this._states.length;
		}

		/**
		 * 弹出当前的状态 并且去执行后面的状态
		 * @param state 要结束的状态，必须与当前状态吻合才会奏效。如果传递null则默认是结束当前状态（慎用）
		 * @return 弹出的状态
		 */
		public shift(state?:State):State
		{
			if(this._states.length == 0) return null;
			var stateExit:State = this._states[0];
			if(state != null && stateExit != state) return null;
			// 调用onExit方法，获得传递给下一个状态的参数，这个参数是来自于调用State constructor里面callback的返回
			var data:any = stateExit.onExit(this._context);
			// 调用onRemove方法，并且将该状态移除掉， 这个参数是来自于调用State constructor里面callback的->置为 null
			stateExit.onRemove(this._context);
			this._states.shift();//移除_states里第一个状态

			if(this._pause)
			{
				// 如果有暂停，则暂时停止执行下一个状态
				this._pauseData = data;
			}
			else if(this._states.length == 0)
			{
				// 已经没有下一个状态了，自动暂停状态机
				this.pause();
				this._pauseData = data;
			}
			else
			{
				// 准备进入下一个状态：
				// 还有下一个状态。如果需要跳过，则直接跳过该状态进入下一个状态，否则进入该状态
				var entered:boolean = false;
				for(var i:number = 0, len:number = this._states.length; i < len; i++) {
					var stateEnter:State = this._states[0];
					if(!this._context.skip || !stateEnter.skippable())//为什么要使用 “或”, 现在的逻辑是两个skip都为true，才有机会执行_states.shift();
					{
						entered = true;
						stateEnter.onEnter(this._context, data);
						break;
					}
					this._states.shift();
				}
				// 如果跳过了所有状态，则自动暂停状态机
				if(!entered)
				{
					this.pause();
					this._pauseData = data;
				}
			}
			return stateExit;
		}
		
		/**
		 * 手动pass掉当前状态，直接进入下一状态
		 * @param forceFinish 是否在pass掉状态时直接完成该状态
		 * @return 被pass掉的状态
		 */		
		public pass(forceFinish:boolean):State
		{
			if(this._states.length == 0) return null;
			var state:State = this._states[0];
			var manualDelete:boolean = state.onPass(this._context, forceFinish);
			if(!manualDelete) this.shift(state);
			return state;
		}
		
		/** 启动状态机 */
		public start():void
		{
			if(!this._running) {
				// 拷贝所有参数
				for(var key in this._tempUserData) {
                    this._context.getUserData()[key] = this._tempUserData[key];
					delete this._tempUserData[key];
				}
                this._running = true;
				if(this._states.length > 0)
				{
					// 进入第一个状态
                    this._states[0].onEnter(this._context, null);
					// resume
					this.resume();
				}
				else
				{
					this.pause();
				}
			}
		}
		
		/** 停止状态机 */
		public stop():void
		{
			if(this._running) {
				// 调用第一个状态的onExit方法
				if(this._states.length > 0) this._states[0].onExit(this._context);
                this._running = false;
				// 销毁上下文
                this._context.clear();
				// 恢复暂停状态
                this._pause = false;
                this._pauseData = null;
			}
		}
		
		/** 暂停在当前状态 */
		public pause():void
		{
            this._pause = true;
		}
		
		/** 重新开启 */
		public resume():void
		{
			if(this._pause && this._states.length > 0) {
                this._pause = false;
				// 还有下一个状态，进入下一个状态
				var stateEnter:State = this._states[0];
				var data:any = this._pauseData;
                this._pauseData = null;
				stateEnter.onEnter(this._context, data);
			}
		}
		
		/** 跳过所有状态 */
		public skipAllStates():void
		{
            this._context.skip = true;
		}
		
		/** 清理所有状态 */
		public clear():void
		{
			this.stop();
			// 移除掉所有状态
			for(var i:number = 0, len:number = this._states.length; i < len; i++)
            {
				// 调用onRemove方法，并且将该状态移除掉
                this._states[0].onRemove(this._context);
                this._states.shift();
			}
		}
		
		private static _stateMachines:StateMachine[] = [];
		private static _updating:boolean = false;
		private static _lastTime:number;
		/**
		 * 托管状态机，如果状态内有需要update的状态，就需要托管。如果没有则可以不托管
		 * @param stateMachine 要托管的状态机
		 */		
		public static delegateStateMachine(stateMachine:StateMachine):void
		{
			if(StateMachine._stateMachines.indexOf(stateMachine) < 0) StateMachine._stateMachines.push(stateMachine);
			if(!StateMachine._updating) {
                PIXI.ticker.shared.add(StateMachine.onEnterFrame);
                StateMachine._lastTime = new Date().getTime();
                StateMachine._updating = true;
			}
		}
		
		/**
		 * 取消托管状态机
		 * @param stateMachine 要取消托管的状态机
		 */		
		public static undelegateStateMachine(stateMachine:StateMachine):void
		{
			var index:number = StateMachine._stateMachines.indexOf(stateMachine);
			if(index >= 0) StateMachine._stateMachines.splice(index, 1);
			if(StateMachine._updating) {
                PIXI.ticker.shared.remove(StateMachine.onEnterFrame);
                StateMachine._lastTime = 0;
                StateMachine._updating = false;
			}
		}
		
		private static onEnterFrame(deltaTime:number):void {
			// 计算毫秒间隔
			var time:number = new Date().getTime();
			var delta:number = time - StateMachine._lastTime;
            StateMachine._lastTime = time;
			// 调用每一个已启动的状态机的onUpdate方法，将毫秒间隔传递过去
			for(var i:number = 0, len:number = StateMachine._stateMachines.length; i < len; i++)
            {
				var stateMachine:StateMachine = StateMachine._stateMachines[i];
				if(stateMachine.getRunning()) stateMachine.onUpdate(delta);
			}
		}
	}
}