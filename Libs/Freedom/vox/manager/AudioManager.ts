namespace vox.manager{
    import ContextManager = vox.context.ContextManager;
    import IExternal = vox.external.IExternal;
    import ContextManager = vox.context.ContextManager;
    import ContextManager = vox.context.ContextManager;
    import ContextManager = vox.context.ContextManager;
    import ContextManager = vox.context.ContextManager;
    import ContextManager = vox.context.ContextManager;
    import IExternal = vox.external.IExternal;
    import ContextManager = vox.context.ContextManager;
    export class AudioManager{
        private static _bgMusicUrl:string;
        private static _bgMusicPlaying:boolean = false ;
        private static _playingUrls:string[] = [] ;
        private static _completeCbk:Function ;
        private static _mute:boolean ;
        private static _bgMusicLock:boolean = false;

        /**获取是否静音*/
        public static getMute():boolean{
            return AudioManager._mute ;
        }

        /**是否设置静音*/
        public static setMute( value:boolean):void
        {
            if( AudioManager._mute == value ) return ;
            AudioManager._mute = value ;

            //设置本地存储
            var ext:IExternal = ContextManager.context.getExternal() ;
            ext.localStorageSet("mute", value.toString() ) ;

            if( AudioManager._mute){
                AudioManager.stopAll();
            }else if( AudioManager._bgMusicPlaying){
                //取消静音，如果以前 播放背景音乐，则播放背景音乐
                AudioManager.playBGMusic();
            }
        }

        public static initialize():void{
            var external:IExternal = ContextManager.context.getExternal() ;
            var mute:string = external.localStorageGet("mute");
            this._mute = ( mute == "true" ) ;
            //监听声音播放完毕事件
            //TODO
            ExternalEventManager.register("playcallback",AudioManager.onAudioStatus ) ;
        }

        private static onAudioStatus( url:string, state:string, curTime:number, duration:number):void{
            if( state == "ended" && url == AudioManager._bgMusicUrl && !AudioManager._bgMusicLock){
                setTimeout( ()=>{
                    AudioManager._bgMusicLock = true ;
                    AudioManager.stopBGMusic();
                    AudioManager.playBGMusic();
                    setTimeout( ()=>{
                        AudioManager._bgMusicLock = false ;
                    }, 5000 )
                }, 200 ) ;
            }
            if( state == "ended" ){
                if( this._completeCbk != null ){
                    this._completeCbk();
                }
            }
        }

        /**播放背景音乐，会循环播放
         * @param url 如果不传则播放之前记录的背景音乐，否则播放本次传递的url*/
        public static playBGMusic( url?:string ):void
        {
            if( url != null ) AudioManager._bgMusicUrl = url;
            if( AudioManager._bgMusicUrl ){
                AudioManager.playAudio( AudioManager._bgMusicUrl ) ;
                AudioManager._bgMusicPlaying = true ;
            }
        }

        public static stopBGMusic():void
        {
            if(  AudioManager._bgMusicUrl ){
                AudioManager.stopAudio( AudioManager._bgMusicUrl );
            }
            AudioManager._bgMusicPlaying = false ;
        }

        public static loadAudio( url:string ):void{
            if( !url ) return ;
            ContextManager.context.getExternal().loadAudio( url ) ;
        }

        public static playAudio( url:string, completeCbk:Function = Null ):void{
            if( !url ) return ;
            //静音则不操作
            if( AudioManager.getMute() ) return ;
            //如果已经在播放了，不进行操作
            if( AudioManager._playingUrls.indexOf(url) >= 0 ) return ;
            //记录url
            AudioManager._playingUrls.push( url ) ;
            this._completeCbk = completeCbk ;
            //调用外部接口
            ContextManager.context.getExternal().playAudio( url ) ;
        }

        /**暂停播放音频*/
        public static pauseAudio( url:string ):void
        {
            var index:number = AudioManager._playingUrls.indexOf( url ) ;
            //找不到播放的音频，则直接返回
            if( index < 0 ) return ;
            //调用外壳接口
            ContextManager.context.getExternal().pauseAudio( url ) ;
        }

        public static seekAudio( url:string, time:number ):void
        {
            var index:number = AudioManager._playingUrls.indexOf( url ) ;
            if( index < 0 ) return ;
            ContextManager.context.getExternal().seekAudio( url, time ) ;
        }

        public static stopAudio( url:string ):void{
            var index:number = AudioManager._playingUrls.indexOf( url ) ;
            if( index < 0 ) return ;
            //调用外壳接口
            ContextManager.context.getExternal().stopAudio( url ) ;
            //删除记录
            AudioManager._playingUrls.splice( index, 1 );
        }

        public static stopAll():void{
            var external:IExternal = ContextManager.context.getExternal() ;
            while ( AudioManager._playingUrls.length>0 ){
                var url:string = AudioManager._playingUrls.shift() ;
                external.stopAudio( url ) ;
            }
        }


    }
}