/// <reference path="../State.ts"/>
/// <reference path="../StateContext.ts"/>

namespace vox.utils.statemachine.states
{
	/**
	 * 功能: 可以用来执行一个方法的状态，可以将方法返回值传递给下一个状态
	 * <br>
	 * 版权: ©Raykid
	 * <br>
	 * 作者: Raykid
	 */
	export class FunctionState implements vox.utils.statemachine.State
	{
		private _callback:(...args:any[])=>any;
		private _thisArg:any;
		private _args:any[];
		private _returnValue:any;
		
		public skippable():boolean
		{
			return true;
		}
		
		public constructor(callback:(...args:any[])=>any, thisArg?:any, ...args:any[])
		{
			this._callback = callback;
			this._thisArg = thisArg;
			this._args = args;
		}
		
		public onAdd(context:vox.utils.statemachine.StateContext):void
		{
		}
		
		public onEnter(context:vox.utils.statemachine.StateContext, data:any):void
		{
			if(this._callback != null)
            {
				var args:any[] = [context].concat(this._args);
				this._returnValue = this._callback.apply(this._thisArg, args);
			}
			context.finish(this);
		}
		
		public onUpdate(context:vox.utils.statemachine.StateContext, delta:number):void
		{
		}
		
		public onPass(context:vox.utils.statemachine.StateContext, forceFinish:boolean):boolean
		{
			return false;
		}
		
		public onExit(context:vox.utils.statemachine.StateContext):any
		{
			// 将方法返回值传递给下一个状态
			return this._returnValue;
		}
		
		public onRemove(context:vox.utils.statemachine.StateContext):void
		{
            this._returnValue = null;
		}
	}
}