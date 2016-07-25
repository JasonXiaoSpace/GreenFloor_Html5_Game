/// <reference path="../scene/IScene.ts"/>
/// <reference path="../scene/IScenePolicy.ts"/>
/// <reference path="../scene/policies/NoneScenePolicy.ts"/>

/**
 * Created by Raykid on 2016/4/14.
 */
namespace vox.manager
{
    export class SceneManager
    {
        public static defaultPolicy:vox.scene.IScenePolicy = vox.scene.policies.NoneScenePolicy.getInstance();

        private static _sceneStack:vox.scene.IScene[] = [];

        /**
         * 切换场景，替换当前场景，当前场景会被销毁
         * @param scene 要切换到的场景
         * @param data 可能要携带给下一个场景的数据
         */
        public static switchScene(scene:vox.scene.IScene, data?:any):void
        {
            // 非空判断
            if(scene == null) return;
            // 如果切入的是第一个场景，则改用pushScene操作
            if(SceneManager._sceneStack.length == 0)
            {
                SceneManager.pushScene(scene, data);
                return;
            }
            // 获取目标场景的弹出策略
            var policy:vox.scene.IScenePolicy = scene.getPolicy();
            if(policy == null) policy = SceneManager.defaultPolicy;
            if(policy == null) policy = vox.scene.policies.NoneScenePolicy.getInstance();
            // 不是第一个场景，替换掉第一个场景
            var length:number = SceneManager._sceneStack.length;
            var curScene:vox.scene.IScene = SceneManager._sceneStack[length - 1];
            // 调用准备接口
            policy.prepareSwitch(curScene, scene);
            // 前置处理
            curScene.onBeforeSwitchOut(scene, data);
            scene.onBeforeSwitchIn(curScene, data);
            // 调用切换接口
            policy.switch(curScene, scene, ()=>{
                SceneManager._sceneStack[length - 1] = scene;
                // 后置处理
                curScene.onAfterSwitchOut(scene, data);
                scene.onAfterSwitchIn(curScene, data);
            });
        }

        /**
         * 切换场景
         * @param scene 要切换到的场景
         * @param data 可能要携带给下一个场景的数据
         */
        public static pushScene(scene:vox.scene.IScene, data?:any):void
        {
            // 非空判断
            if(scene == null) return;
            // 获取目标场景的弹出策略
            var policy:vox.scene.IScenePolicy = scene.getPolicy();
            if(policy == null) policy = SceneManager.defaultPolicy;
            if(policy == null) policy = vox.scene.policies.NoneScenePolicy.getInstance();
            // 插入场景
            var curScene:vox.scene.IScene = SceneManager._sceneStack[SceneManager._sceneStack.length - 1];
            // 调用准备接口
            policy.preparePush(curScene, scene);
            // 前置处理
            if(curScene != null) curScene.onBeforeSwitchOut(scene, data);
            scene.onBeforeSwitchIn(curScene, data);
            // 调用切换接口
            policy.push(curScene, scene, ()=>{
                SceneManager._sceneStack.push(scene);
                // 后置处理
                if(curScene != null) curScene.onAfterSwitchOut(scene, data);
                scene.onAfterSwitchIn(curScene, data);
            });
        }

        /**
         * 切换场景
         * @param scene 要切换出的场景，仅做验证用，如果当前场景不是传入的场景则不会进行切换场景操作
         * @param data 可能要携带给下一个场景的数据
         */
        public static popScene(scene:vox.scene.IScene, data?:any):void
        {
            var length:number = SceneManager._sceneStack.length;
            // 如果是最后一个场景则什么都不做
            if(length <= 1)
            {
                console.log("已经是最后一个场景，无法执行popScene操作");
                return;
            }
            // 验证是否是当前场景，不是则直接移除，不使用Policy
            var index:number = SceneManager._sceneStack.indexOf(scene);
            if(index != length - 1)
            {
                var curScene:vox.scene.IScene = SceneManager._sceneStack[length - 1];
                // 调用接口
                scene.onBeforeSwitchOut(curScene, data);
                scene.onAfterSwitchOut(curScene, data);
                // 弹出场景
                SceneManager._sceneStack.splice(index, 1);
                return;
            }
            // 获取当前场景的弹出策略
            var policy:vox.scene.IScenePolicy = scene.getPolicy();
            if(policy == null) policy = SceneManager.defaultPolicy;
            if(policy == null) policy = vox.scene.policies.NoneScenePolicy.getInstance();
            // 弹出一个场景
            var targetScene:vox.scene.IScene = SceneManager._sceneStack[length - 2];
            // 调用准备接口
            policy.preparePop(scene, targetScene);
            // 前置处理
            scene.onBeforeSwitchOut(targetScene, data);
            targetScene.onBeforeSwitchIn(scene, data);
            // 调用切换接口
            policy.pop(scene, targetScene, ()=>{
                SceneManager._sceneStack.pop();
                // 后置处理
                scene.onAfterSwitchOut(targetScene, data);
                targetScene.onAfterSwitchIn(scene, data);
            });
        }
    }
}