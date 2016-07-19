/**
 * Created by Raykid on 2016/4/21.
 */
namespace vox.utils
{
    import IPopup = vox.popup.IPopup;
    import MaskUtil = vox.net.MaskUtil;
    export interface IMaskEntity
    {
        //--------------关于loading------------------
        /**去显示 loading*/
        showLoading():void;
        /**去隐藏 loading*/
        hideLoading():void;
        /**loading 正在显示*/
        isShowingLoading():boolean;

        //------------关于mask------------------
        showMask( alpha?:number ):void
        hideMask():void
        isShowingMask():boolean ;

        //------------关于模态mask-----------------
        showModalMask( popup:IPopup, alpah?:number ):void
        hideModalMask( popup:IPopup ):void ;
        isShowingModalMask( popup:IPopup ):boolean ;
    }

    export class MaskUtil
    {
        private static _entity:IMaskEntity ;
        public static initialize( entity:IMaskEntity ):void
        {
            this._entity = entity ;
        }


        public static showLoading():void
        {
            if( MaskUtil._entity != null ) MaskUtil._entity.showLoading() ;
        }
        public static hideLoading():void{
            if( MaskUtil._entity != null ) MaskUtil._entity.hideLoading() ;
        }
        public static isShowingLoading():boolean{
            if( MaskUtil._entity != null ) return MaskUtil._entity.isShowingLoading() ;
            return false ;
        }



        public static showMask( alpha?:number ):void
        {
            if( MaskUtil._entity != null ) MaskUtil._entity.showMask( alpha ) ;
        }
        public static hideMask():void
        {
            if( MaskUtil._entity != null ) MaskUtil._entity.hideMask() ;
        }
        public static isShowingMask():boolean{
            if( MaskUtil._entity != null ) return MaskUtil._entity.isShowingMask() ;
            return false ;
        }



        public static showModalMask( popup:IPopup, alpha?:number):void {
            if( MaskUtil._entity != null ) MaskUtil._entity.showModalMask( popup, alpha ) ;
        }
        public static hideModalMask( popup:IPopup ):void {
            if( MaskUtil._entity != null ) MaskUtil._entity.hideModalMask( popup ) ;
        }
        public static isShowingModalMask( popup:IPopup ):boolean {
            if( MaskUtil._entity != null ) return MaskUtil._entity.isShowingModalMask( popup ) ;
            return false;
        }
    }
}