namespace vox.manager{
    import IModule = vox.module.IModule;
    import IModuleClass = vox.module.IModuleClass;
    import ApplicationContext = vox.context.ApplicationContext;
    import ContextManager = vox.context.ContextManager;
    import EnvCode = vox.system.EnvCode;
    import LogUtils = vox.utils.LogUtils;
    import LogLevel = vox.utils.LogLevel;
    import AppEvent = vox.events.AppEvent;

    export interface IModuleProxy{
        /**
         * 使用模块儿名称获取模块儿引用
         * @param moduleName 模块儿名称
         * @param moduleClazz 模块儿类型
         * @param callback 模块儿生成完毕的回调方法*/
        getModule( moduleName:string, moduleClazz:IModuleClass, callback:(module:IModule)=>void ):void ;
    }

    export class ModuleManager{

        private static _lastModule                :IModule = null ;
        private static _lastData                  :any = null ;

        private static _proxy                     :IModuleProxy ;

        private static _defaultModuleName         :string ;
        /**名字 对应ModuleClass*/
        private static _moduleClasses             :{[name:string]:IModuleClass} = {} ;
        /**active 名字 对应 Module*/
        private static _activeModuleDict          :{[name:string]:IModule} = {} ;
        /**active 名字 对应 IModule*/
        private static _activeModuleList          :IModule[] = [] ;
        /**正在加载的Module的名字*/
        private static _loadingModuleDict         :{[name:string]:string} = {} ;


        public static initialize( proxy:IModuleProxy):void
        {
            ModuleManager._proxy = proxy ;
        }

        /**获取默认模块儿名(第一个注册的模块儿)
         * @return {string}*/
        public static getDefaultModule():string{
            return ModuleManager._defaultModuleName ;
        }

        /*把模块类 和 名字 注册到_moduleClasses里面*/
        public static registerModule( moduleName, moduleClazz:IModuleClass):void
        {
            if( ModuleManager._defaultModuleName == null ) this._defaultModuleName = moduleName ;
            ModuleManager._moduleClasses[moduleName] = moduleClazz ;
        }

        /*模块儿是否在活动中
        * @param moduleName
        * @return {boolean} 表示是否正在活动*/
        public static isActive( moduleName:string ):boolean{
            var result:boolean = ( ModuleManager._activeModuleDict[ moduleName] != null || ModuleManager._loadingModuleDict[moduleName] != null ) ;
            return result ;
        }

        /*获取当前模块，其实是最后一个*/
        public static getCurModule():IModule{
            return ModuleManager._activeModuleList[ ModuleManager._activeModuleList.length - 1 ] ;
        }

        /*活动模块的个数*/
        public static getActiveCount():number{
            return this._activeModuleList.length ;
        }

        /*使用模块名称显示模块
        * @param moduleName 模块儿名称
        * @param data 可能的数据*/
        public static showModule( moduleName:string, data?:any):void{
            if( moduleName == null ) return ;
            var moduleClass:IModuleClass = ModuleManager._moduleClasses[ moduleName ] ;
            if( moduleClass == null ) return ;
            //如果这个模块已经开启，则不进行操作
            if( ModuleManager.isActive(moduleName) ) return ;
            //获取模块对象
            //TODO 没有想清楚 loadFlag的意义
            var loadFlag:boolean = true ;
            ModuleManager._proxy.getModule( moduleName, moduleClass, (thisModule:IModule)=>{
                //初始化模块
                var context:ApplicationContext = ContextManager.context ;
                if( context.getSystemConfig().envCode == EnvCode.dev ){
                    thisModule.__initialize();
                }else{
                    try{
                        thisModule.__initialize();
                    }catch(err){
                        LogUtils.log( err.toString(), LogLevel.Err ) ;
                    }
                }
                //获取上一个模块
                ModuleManager._lastModule = this.getCurModule() ;
                ModuleManager._lastData = data ;
                var lastModule:IModule = ModuleManager._lastModule ;

                //放入活动模块儿表
                ModuleManager._activeModuleDict[moduleName] = thisModule ;
                ModuleManager._activeModuleList.push( thisModule ) ;

                //发送准备切换模块儿事件
                ContextManager.context.dispatch( AppEvent.Evt_PreChangeModule, thisModule, ModuleManager._lastModule ) ;

                //调用show方法
                if( context.getSystemConfig().envCode === EnvCode.dev ){
                    thisModule.setShowHandler( ()=>{
                        thisModule.onActivate( ModuleManager._lastModule, ModuleManager._lastData ) ;
                    })
                    thisModule.show(data);
                }else{
                    try{
                        thisModule.setShowHandler( ()=>{
                            try{
                                thisModule.onActivate( ModuleManager._lastModule, ModuleManager._lastData ) ;
                            }catch(err){
                                LogUtils.log( err.toString(), LogLevel.Err ) ;
                            }
                        });
                        thisModule.show( data );
                    }catch( err ){
                        LogUtils.log( err.toString(), LogLevel.Err ) ;
                    }
                }

                //发送切换模块儿事件
                ContextManager.context.dispatch( AppEvent.Evt_ChangeModule, thisModule, lastModule ) ;
                if( !loadFlag ){
                    ContextManager.context.dispatch( AppEvent.Evt_LoadModuleComplete, moduleName, data ) ;
                }
                loadFlag = false ;
            });
            if( loadFlag ){
                loadFlag = false ;
                ContextManager.context.dispatch( AppEvent.Evt_StartLoadModule, moduleName, data ) ;
            }
        }

        /*关闭模块
        * 先pureClose
        * 再发送切换模块事件
        * 然后 TODO 后面做了什么?
        * @param moduleName 模块儿的名称
        * @param data 可能的数据*/
        public static closeModule( moduleName:string, data?:any):void{
            ModuleManager._lastModule = this.getCurModule() ;
            ModuleManager._lastData = data ;

            //取到活动模块儿表中的内容
            var module:IModule = ModuleManager.pureClose( moduleName, data ) ;
            if( module != null ){
                //获取最新模块儿
                var curModule:IModule = this.getCurModule() ;
                //发送准备切换模块儿事件  新的Module 老的Module
                ContextManager.context.dispatch( AppEvent.Evt_PreChangeModule, curModule, module ) ;
                //发送切换模块儿事件
                ContextManager.context.dispatch( AppEvent.Evt_ChangeModule, curModule, module ) ;
            }
        }

        /*退回到指定模块儿
        * @param moduleName 要退回到的模块名称
        * @param data 可能的数据
        * @param {boolean} 如果找到了模块返回true, 没有找到返回false*/
        public static backToModule( moduleName:string, data?:any ):boolean
        {
            //取到活动模块儿表中的内容
            var module:IModule = ModuleManager._activeModuleDict[moduleName];
            if( module == null ) return false ;

            //首先将当前模块儿和目标模块儿之间的所有模块儿关闭
            var tempList:IModule[] = ModuleManager._activeModuleList.concat() ;
            var index:number = tempList.indexOf( module );
            for( var i:number = tempList.length - 2 ; i > index ; i -- ){
                var tmpModule:IModule = tempList[i];
                ModuleManager.pureClose( tmpModule.getName(), data ) ;
            }

            //然后正常关闭当前模块
            var curModule:IModule = tempList[ tempList.length - 1 ] ;
            ModuleManager.closeModule( curModule.getName(), data ) ;
            return true ;
        }

        //---------------------------内部工具方法-----------------------------------
        /*单纯只是为了关闭
        * 1 执行setCloseHandler dispose
        * 2 从活动列表中清除*/
        private static pureClose( moduleName:string, data?:any):IModule{
            //取到活动模块儿表中的内容
            var module:IModule = ModuleManager._activeModuleDict[moduleName];
            if( module != null ){
                //关闭模块
                var context:ApplicationContext = ContextManager.context ;
                if( context.getSystemConfig().envCode === EnvCode.dev ){
                    //开发环境不使用try catch，防止查找错误麻烦
                    module.setCloseHandler(()=>{
                       //销毁当前模块
                        module.dispose() ;
                    })
                    module.close(data);
                }else{
                    try{
                        module.setCloseHandler( ()=>{
                            try{
                                module.dispose();
                            }catch(err){
                                LogUtils.log( err.toString(), LogLevel.Err ) ;
                            }
                        })
                        module.close(data) ;
                    }catch(err){
                        LogUtils.log( err.toString(), LogLevel.Err ) ;
                    }
                }
                //从活动模块中移除
                delete ModuleManager._activeModuleDict[moduleName];
                ModuleManager._activeModuleList.splice( ModuleManager._activeModuleList.indexOf(module), 1 ) ;
            }
            return module;
        }
    }
}