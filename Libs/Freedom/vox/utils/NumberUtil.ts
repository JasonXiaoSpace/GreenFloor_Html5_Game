/**
 * Created by Raykid on 2016/5/19.
 */
namespace vox.utils
{
    export class NumberUtil
    {
        /**
         * 将数字转换为指定长度的字符串，整数部分不足指定长度的在前面用0填充
         * @param num 要转换的数字
         * @param length 整数部分长度
         */
        public static toLengthString(num:number, length:number):string
        {
            var numStr:string = num.toString();
            var index:number = numStr.indexOf(".");
            if(index < 0) index = numStr.length;
            var int:string = numStr.substr(0, index);
            var frac:string = numStr.substr(index);
            for(var i:number = int.length; i < length; i++)
            {
                int = "0" + int;
            }
            return (int + frac);
        }
    }
}