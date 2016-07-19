namespace vox.scene{
    import IDisposable = vox.intefaces.IDisposable;
    export interface IScene extends IDisposable{

        /**获取场景名称*/
        getName():string;
        /**获取场景的实本显示对象*/
        getEntity():any ;
        /**获取切换策略*/
        getPolicy():IScenePolicy;

        onBeforeSwitchIn( sceneFrom:IScene, data?:any ):void

        onAfterSwitchIn( sceneFrom:IScene, data?:any ):void ;

        onBeforeSwitchOut( sceneTo:IScene, data?:any ):void ;

        onAfterSwitchOut( sceneTo:IScene, data?:any ):void ;
    }
}