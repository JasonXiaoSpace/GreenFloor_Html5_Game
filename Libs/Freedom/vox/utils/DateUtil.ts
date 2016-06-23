namespace vox.utils
{
    export class DateUtil
	{
		/**
		 * 格式化日期和时间
		 * @param format        格式，如"yyyy-MM-dd-hh-mm-ss"
		 */
		public static getFormattedDate(format: string): string
		{
			let tempDate: Date = new Date();
			let o: any = {
				"M+": tempDate.getMonth() + 1, //month
				"d+": tempDate.getDate(), //day
				"h+": tempDate.getHours(), //hour
				"m+": tempDate.getMinutes(), //minute
				"s+": tempDate.getSeconds(), //second
				"q+": Math.floor((tempDate.getMonth() + 3) / 3), //quarter
				"S": tempDate.getMilliseconds() //millisecond
			};
			if (/(y+)/.test(format))
			{
				format = format.replace(RegExp.$1,
					(tempDate.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for (let k in o)
			{
				if (new RegExp("(" + k + ")").test(format))
				{
					format = format.replace(RegExp.$1,
						RegExp.$1.length == 1 ? o[k] :
							("00" + o[k]).substr(("" + o[k]).length));
				}
			}

			return format;
		};
	}

}