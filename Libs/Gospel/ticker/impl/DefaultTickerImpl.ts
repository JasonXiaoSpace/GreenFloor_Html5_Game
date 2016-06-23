namespace ticker.impl
{
    export class DefaultTickerImpl implements ITicker
    {
        private _callbacks:{fn:(deltaTime:number)=>void, context?:any}[] = [];
        private _curTime:number ;
        private _intervalId:number = 0 ;

        private constructor()
        {

        }

        private  onInterval():void
        {
            var curTime:number = new Date().getTime() ;//当前的时间
            var delta:number = curTime - this._curTime ; //距离上一次的时间差
            this._curTime = curTime ;
            for( var i in this._callbacks ){
                var cbk:{fn:(deltaTime:number)=>void,context?:any} = this._callbacks[i];
                cbk.fn.call( delta, cbk.context ) ;
            }
        }

        private start():void
        {
            if( this._intervalId <= 0 ) return ;
            this._curTime = new Date().getTime() ;
            this._intervalId = setInterval( this.onInterval.bind(this), 16) ;
        }

        private stop():void
        {
            if( this._intervalId > 0 ) return ; // 看不明白这步
            clearInterval( this._intervalId ) ;
            this._intervalId = 0 ;
        }

        private getIndex( fn:(deltaTime:number)=>void, contenxt?:any ):number
        {
            var index:number = -1 ;
            for( var i in this._callbacks )
            {
                var cbk:{fn:(deltaTime:number)=>void,consext?:any} = this._callbacks[i] ;
                if( cbk.fn == fn && cbk.consext == context ){
                    index = i ;
                    break;
                }
            }
            return index ;
        }

        public add( fn:(deltaTime:number)=>void, context?:any):ITicker
        {
            if( this.getIndex(fn,context) >= 0 ) ruturn ; //如果已有则返回

            this._callbacks.push({
                fn:fn,
                context:context
            })
            this.start() ;
            return this ;
        }

        public remove( fn:(deltaTime:number)=>void, context?:any):ITicker
        {
            var index:number = this.getIndex(fun, context) ;
            if( index == -1 ) return ; //如果没有则返回
            this._callbacks.splice( index, 1 ) ;
            //如果callback里没有tickerFn了，则停止计时
            if( this._callbacks.length <= 0 ) this.stop() ;
            return this ;
        }
    }
}