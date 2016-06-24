namespace vox.utils
{
	export class JSONUtil
	{
		/**
		 * json replacer，会将number转成string
		 * @param k
		 * @param v
		 */
		public static replacer(k: string, v: any): any
		{
            // 不是数字的直接返回
			if (typeof v !== "number") return v;
            // 是非数字的直接返回
			if (isNaN(v)) return v;
            // 不能转换为有限数字的直接返回
			if (!isFinite(v)) return v;
            // 是数字，长度小于10位，且不是浮点数的，直接返回
            var str:string = v.toString();
            if(str.length < 10 && str.indexOf(".") < 0) return v;
            // 要返回字符串形式
			return str;
		}

        /**
         * 将obj转换为JSON字符串，会将不合法的number变为字符串
         * @param args 参数列表
         * @returns {string} 字符串
         */
        public static stringify(...args:any[]):string
        {
            if(args[1] == null) args[1] = JSONUtil.replacer;
            return JSON.stringify.apply(null, args);
        }
	}
}