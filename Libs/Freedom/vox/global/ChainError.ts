namespace vox.global{
    export class ChainError extends Error{

        /**错误码*/
        public code:string ;

        /**由哪个错误引起的*/
        public cause:Error ;

        constructor(msg:string, code?:string, cause?:Error){
            super( msg ) ;
            this.code = code ;
            this.cause = cause ;
        }

        toString(){
            let s = super.toString ;
            if( this.code ){
                s = `Error #${ this.code }: ${s})` ;
            }
            if( this.cause ){
                s = `${s} ( caused by: ${this.cause})` ;
            }
            return s ;
        }

        toJSON(){
            return this.toString ;
        }
    }
}