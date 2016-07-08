namespace vox.utils{
    import SystemConfig = vox.system.SystemConfig;
    import ContextManager = vox.external.ContextManager;
    import ChainError = vox.global.ChainError;
    export class URLUtils{

        /**规整url*/
        public static trimUrl( url:string ):string{
            // 去除多余的"/"
            url = url.replace(/([^:/])(\/)+/g, "$1/") ;
            // 处理 "/xx/../"
            url = url.replace(/\/[^\/]+?\/\.\.\//g, "/");
            return url ;
        }

        /**替换url中的host的工具方法*/
        public static wrapHost( url:string, host:string, forced:boolean = false ):string
        {
            host = host || "/" ;
            var regExp:RegExp = /^(?:[^\/]+):\/{2,}(?:[^\/]+)\//;
            var arr:string[] = url.match( regExp ) ;
            if( arr && arr.length > 0 ){
                if( forced ){
                    url = url.substr( arr[0].length ) ;
                    url = host + "/" + url ;
                }
            }else{
                url = host + "/" + url ;
            }
            url = URLUtils.trimUrl( url ) ;
            return url ;
        }

        /**把url里的host替换成 domain */
        public static wrapRequestUrl( url:string, forced?:boolean):string{
            var cfg:SystemConfig = ContextManager.context.getSystemConfig() ;
            if( cfg.domain ){
                return URLUtils.wrapHost( url, cfg.domain, forced ) ;
            }else{
                return url ;
            }
        }


        /**将相对于当前页面的相对路径包装成绝对路径
         * 看不懂 肖建军*/
        public static wrapAbsolutePath( relativePath:string ):string{
            let curPath:string = window.location.href ;
            let tempIndex:number = curPath.lastIndexOf("/") ;
            curPath = curPath.substring( 0, tempIndex + 1 ) ;
            return URLUtils.trimUrl( curPath + relativePath ) ;
        }

        /**获取url的host+pathname部分，即问号?以前的部分*/
        public static getHostAndPathName( url:string ):string{
            if( url == null ) throw new ChainError("url不能为空") ;
            return url.split("?")[0] ;
        }


        /**解析url查询参数*/
        public static getQueryParams( url:string ):Object{
            var params:Object = {};
            var queryString:string = url.substring( url.search(/\?/) + 1 ) ;
            var kvs:string[] = queryString.split("&") ;
            kvs.forEach( function(kv:string){
                var pair:string[] = kv.split("=",2);
                if( pair.length !== 2 || !pair[0] ){
                    LogUtils.log(`[URLUtils] invalid query params:${kv}`) ;
                    return ;
                }
                var key = decodeURIComponent( pair[0]) ;
                var value = decodeURIComponent( pair[1]) ;
                params[ key ] = value ;
            });
            return params ;
        }


        /**将参数连接到指定URL后面
         * @param url url
         * @param params 一个map 包含要连接的参数
         * @return string 连接后的url地址*/
        public static joinQueryParams( url:string, params:Object ):string{
            if( url == null ) throw new ChainError("url不能为空") ;
            var oriParams:Object = URLUtils.getQueryParams( url ) ;
            var targetParams:Object = ObjectUtil.extendObject( oriParams, params ) ;
            url = URLUtils.getHostAndPathName( url ) ;
            var isFirst:boolean = true ;
            for( var key in targetParams ){
                if( isFirst ){
                    isFirst = false ;
                    url += "?" + encodeURIComponent( key ) + "=" + encodeURIComponent( targetParams[key] ) ;
                }else{
                    url += "&" + encodeURIComponent( key ) + "=" + encodeURIComponent( targetParams[key] ) ;
                }
            }
            return url ;
        }
    }
}