namespace vox.popup{
    export interface IPopupPolicy{
        /*显示时调用
        * @param popup 弹出框对象
        * @param callback 完成回调，必须调用
        * @param from 动画起始点*/
        show( popup:IPopup, cbk:()=>void, from?:{x:number,y:number}):void;

        /*关闭时调用
        * @param popup 弹出框对象
        * @param cbk 完成回调，必须调用
        * @param to 动画完结点*/
        close( popup:IPopup, cbk:()=>void, to?:{x:number,y:number}):void;
    }
}