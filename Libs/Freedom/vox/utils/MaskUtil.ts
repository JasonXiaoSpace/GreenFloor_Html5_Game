/**
 * Created by Raykid on 2016/4/21.
 */
namespace vox.utils
{
    export interface IMaskEntity{
        showLoading():void;
        hideLoading():void;
        isShowingLoading():boolean;
    }

    export class MaskUtil{
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
    }
}