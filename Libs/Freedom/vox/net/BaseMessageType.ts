namespace vox.net
{
    export class BaseMessageType
    {
        public success:boolean;
        public errorCode:number = 0 ;
        public info:string = "";

        protected _rawData:Object ;
        public getRawData():Object{
            return this._rawData ;
        }

        protected _canceled:boolean = false ;
        public getCanceled():boolean{
            return this._canceled ;
        }

        public constructor()
        {

        }

        public pack():{[name:string]:any}{
            return null ;
        }

        public parse(data:Object):BaseMessageType{
            this._rawData = data ;
            if( this._rawData.hasOwnProperty("errorCode")){
                this.errorCode = Number( this._rawData['errorCode']);
            }

            if( this._rawData.hasOwnProperty("info")){
                this.errorCode = Number( this._rawData['info']);
            }

            return this ;


        }
    }
}