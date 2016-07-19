namespace vox.popup.policies{
    export class NonePopupPolicy{
        private static _instance:NonePopupPolicy ;
        public static getInstance():NonePopupPolicy{
            if( NonePopupPolicy._instance == null ){
                NonePopupPolicy._instance = new NonePopupPolicy() ;
            }
            return NonePopupPolicy._instance ;
        }

        public show( pop:IPopup, cbk:Function, form?:{x:number,y:number}):void{
            cbk();
        }

        public close( popup:IPopup, cbk:()=>void, to?:{x:number,y:number}):void{
            cbk();
        }
    }
}