namespace vox.manager{
    import IPopupPolicy = vox.popup.IPopupPolicy;
    import NonePopupPolicy = vox.popup.policies.NonePopupPolicy;
    import IPopup = vox.popup.IPopup;
    import IPromptPopup = vox.popup.IPromptPopup;
    import IPromptHandler = vox.popup.IPromptHandler;
    import ButtonType = vox.popup.ButtonType;
    import ContextManager = vox.context.ContextManager;
    import AppEvent = vox.events.AppEvent;
    import MaskUtil = vox.utils.MaskUtil;
    export class PopupManager {

        public static defaultPolicy          :IPopupPolicy = NonePopupPolicy.getInstance() ;

        private static _popupList            :IPopup[];
        private static _popupDict            :{[name:string]:IPopup} = {} ;
        private static _prompt               :IPromptPopup ;

        /*获取当前显示的弹窗的数量*/
        public static getCount():number{
            return this._popupList.length ;
        }

        public static initilize( prompt:IPromptPopup ):void{
            PopupManager._prompt = prompt ;
        }

        /*显示提示窗口*/
        public static prompt( msg:string, ...handlers:IPromptHandler[]):void{
            var args:any[] = [ msg ] ;
            for( var i in handlers ){
                var handler:IPromptHandler = handler[ i ] ;
                if( handler.text == null ) handler.text = handler.data ;
                if( handler.buttonType == null ) handler.buttonType = ButtonType.Normal ;
                args.push( handler ) ;
            }
            PopupManager._prompt.update.apply( PopupManager._prompt, args ) ; //args里有若干参数，一个是msg, 后面都是IPromptHandler
            PopupManager.show( PopupManager._prompt ) ;
        }

        public static alert( msg:string, okHandler?:()=>void ):void
        {
            PopupManager.prompt( msg, {data:"确定", handler:okHandler, buttonType:ButtonType.Important } ) ;
        }

        public static confirm( msg:string, okHandler?:()=>void, cancelHandler?:()=>void ):void{
            PopupManager.prompt( msg,
                {data:"确定", handler:okHandler, buttonType:ButtonType.Important },
                {data:"取消", handler:cancelHandler, buttonType:ButtonType.Normal })
        }

        //----------------------------------下面是主方法----------------------------------------
        /*显示一个弹窗
        * @param popup 要显示的弹窗
        * @param isModal 是否是模态弹出，默认值是true
        * @param from 从该点弹出 (某些弹出策略需要)*/
        public static show( popup:IPopup, isModal:boolean=true, from?:{x:number,y:number}):void{
            var name:string = popup.getName() ;
            //先移除之前的同名弹窗
            PopupManager.close( name ) ;
            //记录弹窗
            PopupManager._popupDict[name] = popup;
            PopupManager._popupList.push( popup ) ;
            //获取弹出策略
            var policy:IPopupPolicy = popup.getPolicy() ;
            if( policy == null ) policy = PopupManager.defaultPolicy ;
            if( policy == null ) policy = NonePopupPolicy.getInstance() ;
            //调用弹出前方法
            popup.onBeforeShow() ;
            //调用弹出策略
            policy.show( popup, popup.onAfterShow.bind(popup), from ) ;
            //如果是模态，则需要遮罩层
            if( isModal ) MaskUtil.showModalMask(popup) ; //TODO
            //派发事件
            ContextManager.context.dispatch( AppEvent.Evt_ShowPopup , popup ) ;

        }

        /*关闭一个弹窗
        * @param popupOrName 弹窗本身或者弹窗名称
        * @param to 关闭到该点 （某些弹出策略的需求）*/
        public static close( popupOrName:IPopup|string, to?:{x:number,y:number}):void{
            var popup:IPopup = null ;
            var name:string ;
            if( typeof popupOrName == "string" ){
                name = popupOrName as string ;
                popup = PopupManager._popupDict[name];
            }else{
                popup = popupOrName as IPopup ;
                name = popup.getName() ;
            }
            if( popup == null ) return ;

            //获取弹窗策略
            var policy:IPopupPolicy = popup.getPolicy() ;
            if( policy == null ) policy = PopupManager.defaultPolicy ;
            if( policy == null ) policy = NonePopupPolicy.getInstance() ;

            //调用弹出前的方法
            popup.onBeforeClose() ;

            //调用弹出策略
            policy.close( popup, popup.onAfterClose.bind(popup), to ) ;

            //删除记录
            delete PopupManager._popupDict[name];
            var index:number = PopupManager._popupList.indexOf( popup ) ;
            if( index >= 0 ) PopupManager._popupList.splice( index, 1 ) ;

            //移除遮罩
            //TODO
            MaskUtil.hideModalMask( popup );

            //派发事件
            ContextManager.context.dispatch( AppEvent.Evt_ClosePopup ) ;
        }


    }
}