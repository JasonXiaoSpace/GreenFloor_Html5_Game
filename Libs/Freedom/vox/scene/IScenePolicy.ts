namespace vox.scene
{
    /**肖建军*/
    export interface IScenePolicy
    {
        /**准备切换场景时调用*/
        prepareSwitch( sceneFrom:IScene, sceneTo:IScene ):void;

        /**切换场景时调用*/
        switch( sceneFrom:IScene, sceneTo:IScene, cbk:()=>void ):void ;

        /**准备push场景时调用*/
        preparePush( sceneFrom:IScene, scentTo:IScene ):void ;

        /**push场景时调用*/
        push( sceneFrom:IScene, sceneTo:IScene, cbk:()=>void ):void ;

        /**准备pop场景时调用*/
        preparePop( sceneFrom:IScene, sceneTo:IScene ):void

        /**pop场景时调用*/
        pop( sceneFrom:IScene, sceneTo:IScene, cbk:()=>void ):void ;



    }
}