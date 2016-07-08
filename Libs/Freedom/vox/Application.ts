namespace vox{
    import ISystemConfig = vox.system.ISystemConfig;
    import IClass = vox.intefaces.IClass;
    import BaseRequestMessage = vox.net.BaseRequestMessage;
    export interface Application{
        /**提供可能的env2domain的转换表，不提供则会使用initParams中的domain*/
        getDomainTransform():{[env:string]:string};
        /**获取测试初始参数，仅在dev环境下才会生效*/
        testInitParams():ISystemConfig;
        /**获取应用程序类型*/
        getType():string ;
        /**获取App名称*/
        getAppName():string;
        /**获取编译版本号，请返回 ${compileVersion}*/
        getCompileVersion():string;
        /**获取html项目版本号，请返回 ${htmlVersion}*/
        getHtmlVersion():string;

        /**列出所有Model Class*/
        listModels():IClass[];
        /**列出所有模块Class*/
        listModules():Object[];
        /**列出所有命令*/
        listCommands():Object[];
        /**列出初始化请求*/
        listInitRequests():BaseRequestMessage[];

        /**初始化Application 由ApplicationContext调用*/
        initialize():void ;

    }
}