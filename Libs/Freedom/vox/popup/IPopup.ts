namespace vox.popup
{
    export interface IPopup{
        /*获取弹窗名称*/
        getName():string
        /*获取弹窗的实体显示对象*/
        getEntity():any ;
        /*获取弹出策略*/
        getPolicy():IPopupPolicy;
        /*在弹出前调用的方法*/
        onBeforeShow():void;
        /*在弹出后调用的方法*/
        onAfterShow():void;
        /*在关闭前调用的方法*/
        onBeforeClose():void;
        /*在关闭后调用的方法*/
        onAfterClose():void;
    }
}