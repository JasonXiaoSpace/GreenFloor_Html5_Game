namespace vox.utils
{
	export class ObjectUtil
	{
		/**
		 * 不是深复制，只复制了一层
		 * populate properties
		 * @param target        目标obj
		 * @param sources       来源obj
		 */
		public static extendObject(target: Object, ...sources: Object[]): Object
		{
			sources.forEach(function (source: Object): void
			{
				if (!source) return;
				for (let propName in source)
				{
					if (source.hasOwnProperty(propName))
					{
						target[propName] = source[propName];
					}
				}
			});

			return target;
		}

		/**
		 * 生成一个随机ID
		 */
		public static getGUID(): string
		{
			let s: string[] = [];
			let hexDigits: string = "0123456789abcdef";
			for (let i: number = 0; i < 36; i++)
			{
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((parseInt(s[19]) & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
			s[8] = s[13] = s[18] = s[23] = "-";

			return s.join("");
		}

		private static _getAutoIncIdMap: { [type: string]: number } = {};
		/**
		 * 生成自增id（从0开始）
		 * @param type
		 */
		public static getAutoIncId(type: string): string
		{
			var callee: ((type: string) => string) = ObjectUtil.getAutoIncId;
			var index: number = ObjectUtil._getAutoIncIdMap[type] || 0;
			ObjectUtil._getAutoIncIdMap[type] = index++;
			return type + "-" + index;
		};
	}
}