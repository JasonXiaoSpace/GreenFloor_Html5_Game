namespace vox.net
{
    export function packArray( arr:any[] ):any[]{
        if( !arr ) return null;
        var result:Array<any> = arr.map( (obj:any)=>{
            if( $.isArray( obj ) ){
                return this.packArray( obj ) ;
            }else if( $.isFunction( obj.pack )){
                return obj.pack() ;
            }else{
                return obj ;
            }
        } )
    }

    interface MessageTypeClazz{
        new ():BaseMessageType;
    }

    export function parseArray( arr:any[], cls?:MessageTypeClazz ):any[]{
        if( !arr ) return [] ;
        var result:Array<any> = [] ;
        for( var i:number = 0, len:number = arr.length ; i<len ; i++){
            var value:any = arr[ i ] ;
            if( cls == null ){
                //子对象是基础类型
                result.push( value ) ;
            }else{
                //子对象是自定义类型
                result.push( new cls().parse( value ) ) ;
            }
        }
        return result ;
    }
}