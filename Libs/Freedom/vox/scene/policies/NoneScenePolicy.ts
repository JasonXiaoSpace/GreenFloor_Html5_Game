namespace vox.scene.policies{
    export class NoneScenePolicy implements IScenePolicy{

        private static _instance:NoneScenePolicy ;

        public static getInstance():NoneScenePolicy{
            if( NoneScenePolicy._instance == null ) NoneScenePolicy._instance = new NoneScenePolicy() ;
            return NoneScenePolicy._instance ;
        }

        /**准备切换场景时调用*/
        public prepareSwitch( sceneFrom:IScene, sceneTo:IScene ):void{}

        /**切换场景时调用*/
        public switch( sceneFrom:IScene, sceneTo:IScene, cbk:()=>void ):void {
            cbk();
        }

        /**准备push场景时调用*/
        public preparePush( sceneFrom:IScene, scentTo:IScene ):void {}

        /**push场景时调用*/
        public push( sceneFrom:IScene, sceneTo:IScene, cbk:()=>void ):void {
            cbk();
        }

        /**准备pop场景时调用*/
        public preparePop( sceneFrom:IScene, sceneTo:IScene ):void

        /**pop场景时调用*/
        public pop( sceneFrom:IScene, sceneTo:IScene, cbk:()=>void ):void {
            cbk();
        }
    }
}