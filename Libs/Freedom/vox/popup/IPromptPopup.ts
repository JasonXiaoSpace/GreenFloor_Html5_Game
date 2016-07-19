namespace vox.popup{
    export interface IPromptPopup extends IPopup{
        /*更新通用提示窗显示
        * @param msg 文案
        * @param handlers 按钮列表*/
        update( msg:string, ...handlers:IPromptHandler[]):void ;
    }

    export enum ButtonType{
        Normal,
        Important
    }

    export interface IPromptHandler{
        /**与按钮绑定的数据*/
        data:any ;
        /**按钮上显示的文本，不传递则默认使用data的字符串值*/
        text?:string ;
        /**回调函数，当前按钮被点击时调用，参数为data对象*/
        handler?:(data:any)=>void ;
        /**按钮类型，默认为normal*/
        buttonType?:ButtonType;
    }

}