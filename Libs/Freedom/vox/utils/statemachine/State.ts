namespace vox.utils.statemachine
{
    export interface State{
        /**是否可以跳过状态*/
        skippable():boolean ;

        /**状态被添加到状态时调用，可以用初始化状态*/
        onAdd( context:StateContext ):void ;

        /**状态进入时调用*/
        onEnter( context:StateContext, data:any ):void

        /**当状态正在进行时，每次EnterFrame都会调用*/
        onUpdate( contest:StateContext, delta:number):void;

        /**当状态被手动pass掉时调用
         * @param context 状态机上下文对象
         * @param forceFinish 是否强制完成该对象
         * @return 返回一个布尔值，表示是否需要自行结束状态*/
        onPass( context:StateContext, forceFinish:boolean ):boolean ;

        /**
         * 状态出时调用
         * @return 可以返回任意数据给下一个状态(只会给下一个状态，如果想在整个生命周期内使用请设置 StateContext.userData)*/
        onExit( context:StateContext ):any ;

        /**
         * 当被移出状态机时调用，可以用来销毁状态*/
        onRemove( context:StateContext ):void ;

    }
}