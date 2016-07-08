namespace vox.system
{
    export interface ISystemConfig{
        envCode?:EnvCode;
        env?:string;
        domain?:string;
        imgDomain?:string;
        clientType?:string;
        clientName?:string;
        app?:string;
        htmlVersion?:string;
        userId?:string;
        uuid?:string;
        ktwelve?:string;
        sessionKey?:string;
        compileVersion?:string;
    }

    export class SystemConfig implements ISystemConfig{
        public envCode:EnvCode = EnvCode.dev ;
        public env:string = "dev" ;
        public domain:string = "http://www.test.17zuoye.net" ;
        public imgDomain:string = "http://cdn-cc.test.17zuoye.net";
        public mainDomain:string = "http://www.test.17zuoye.net";
        public clientType:string = "" ;
        public clientName:string = "" ;
        public app:string = "" ;
        public htmlVersion:string = "" ;
        public userId:string = "" ;
        public uuid:string = "" ;
        public ktwelve:string = "" ;
        public sessionKey:string = "" ;
        public compileVersion:string = "$( compileVersion )" ;
        public nativeVersion:string = '';
    }

    export enum EnvCode{
        dev,
        test,
        staging,
        production
    }
}