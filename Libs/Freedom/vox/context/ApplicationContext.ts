namespace vox.context{
    export class ApplicationContext{
        public initingRequestsComplete:boolean = false ;

        private _queryParam:Object;
        private _externalParam:Object;
        private _initParam:Object;
        private _dispatcher:Object ;
        private _commondDict:{[type:string]:}
    }
}