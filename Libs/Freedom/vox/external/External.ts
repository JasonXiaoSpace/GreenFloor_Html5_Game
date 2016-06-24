namespace vox.external{
    export interface External{
        loadAudio( url:string ):void ;
        playAudio( url:string ):void ;
        pauseAudio( url:string ):void ;
        seekAudio( url:string, time:number ):void ;
        stopAudio( url:string ):void ;

        /**跳转到内部应用*/
        innerJump( name:string ):void ;
    }
}