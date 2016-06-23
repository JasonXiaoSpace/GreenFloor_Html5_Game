namespace vox.utils
{
    export class EnumUtil
    {
        public static getKeys( enm:any ):string[]
        {
            var keys:string[] = [] ;
            for( var key in enm  ){
                if( !$.isNumeric(key)){
                    keys.push( key )
                }
            }
            return keys ;
        }
    }
}