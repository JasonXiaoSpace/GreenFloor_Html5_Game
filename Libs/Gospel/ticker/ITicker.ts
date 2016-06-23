namespace ticker
{
    export var ticker:ITicker = new impl.DefaultTickerImpl() ;

    export interface ITicker
    {
        add( fn:(deltaTime:number)=>void, context?:any ):ITicker ;
        remove( fn:(deltaTime:number)=>void, context?:any ):ITicker ;
    }
}