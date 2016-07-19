namespace vox.manager{
    import IScenePolicy = vox.scene.IScenePolicy;
    import NoneScenePolicy = vox.scene.policies.NoneScenePolicy;
    import IScene = vox.scene.IScene;
    export class SceneManager{

        public static defaultScenePolicy:IScenePolicy = NoneScenePolicy.getInstance() ;

        private static _sceneStack:IScene[] = [] ;

        /*切换场景，替换当前的场景，当前的场景会被销毁
        * @param scene 要切换到的场景
        * @param data 可能要携带给下一个场景的数据*/
        public static switchScene( newScene:IScene, data?:any ):void
        {
            //非空判断
            if( newScene = null ) return ;
            //如果切入的是第一个场景，则改用pushScene操作
            if( SceneManager._sceneStack.length == 0 ){
                SceneManager.pushScene( newScene, data ) ;
                return ;
            }

            //获取目标场景的显示策略
            var policy:IScenePolicy = newScene.getPolicy() ;
            if( policy == null ) policy = SceneManager.defaultScenePolicy ;
            if( policy == null ) policy = NoneScenePolicy.getInstance() ;

            //不是第一个场景，替换掉第一个场景
            var len:number = SceneManager._sceneStack.length ;
            var oldScene:IScene = SceneManager._sceneStack[ len - 1 ] ;

            //调用准备接口
            policy.prepareSwitch( oldScene, newScene ) ;
            //执行退出场景的 onBeforeSwitchOut
            oldScene.onBeforeSwitchOut( newScene, data ) ;
            //执行新进场景的 onBeforeSwithcIn
            newScene.onBeforeSwitchIn( oldScene, data ) ;

            //调用切换接口
            policy.switch( oldScene, newScene, ()=>{
                SceneManager._sceneStack[ len - 1 ] = newScene ;
                //后置处理
                oldScene.onAfterSwitchOut( newScene, data ) ;
                newScene.onAfterSwitchIn( oldScene, data ) ;
            })
        }

        /**切换场景
         * @param newScene 要切换到的场景
         * @param data 可能要携带给下一个场景的数据*/
        public static pushScene( newScene:IScene, data?:any):void{
            //非空判断
            if( newScene == null ) return ;
            //获取目标场景的弹出策略
            var policy:IScenePolicy = newScene.getPolicy() ;
            if( policy == null ) policy = SceneManager.defaultScenePolicy ;
            if( policy == null ) policy = NoneScenePolicy.getInstance() ;
            //插入场景
            var len:number = SceneManager._sceneStack.length ;
            var oldScene:IScene = SceneManager._sceneStack[ len - 1 ] ;
            policy.preparePush( oldScene, newScene ) ;
            //前置处理
            if( oldScene != null ) oldScene.onBeforeSwitchOut( newScene, data ) ;
            newScene.onBeforeSwitchIn( oldScene, data ) ;
            //调用切换接口
            policy.push( oldScene, newScene, ()=>{
                SceneManager._sceneStack.push( newScene ) ;
                //后置处理
                if( oldScene != null ) oldScene.onAfterSwitchOut( newScene, data ) ;
                newScene.onAfterSwitchIn( oldScene, data ) ;
            })
        }

        /**弹出的场景
         * @param oldScene 要切换出的场景，仅做验证用，如果当前场景不是传入的场景则不会进行切换场景操作
         * @param data 可能要携带给下一个场景的数据*/
        public static popScene( oldScene:IScene, data?:any ):void
        {
            var len:number = SceneManager._sceneStack.length ;
            //如果是最后一个场景则什么都不做
            if( len <= 1 ){
                console.log("已经是最后一个场景了，无法执行popScene操作");
                return ;
            }
            //验证是否是当前场景，不是则直接移除，不使用Policy
            var index:number = SceneManager._sceneStack.indexOf( oldScene ) ;
            if( index != len-1 ){
                var curScene:IScene = SceneManager._sceneStack[ len - 1 ] ;
                //调用接口
                oldScene.onBeforeSwitchOut( curScene, data ) ;
                oldScene.onAfterSwitchOut( curScene, data ) ;
                //弹出场景
                SceneManager._sceneStack.splice( index, 1 ) ;
                return ;
            }

            //获取当前场景的弹出策略 这个时间 oldScene就是最后一个场景
            //下面要做的事是，显示倒数第二个场景
            var policy:IScenePolicy = oldScene.getPolicy() ;
            if( policy == null ) policy = SceneManager.defaultScenePolicy ;
            if( policy == null ) policy = NoneScenePolicy.getInstance() ;

            //弹出一个场景
            var newScene:IScene = SceneManager._sceneStack[ len - 2 ] ;
            policy.preparePop( oldScene, newScene );

            //前置处理
            oldScene.onBeforeSwitchOut( newScene, data ) ;
            newScene.onBeforeSwitchIn( oldScene, data ) ;

            //调用切换接口
            policy.pop( oldScene, newScene, ()=>{
                SceneManager._sceneStack.pop() ;

                //后置处理
                oldScene.onAfterSwitchOut( newScene, data ) ;
                newScene.onAfterSwitchIn( oldScene, data ) ;
            })
        }

    }
}