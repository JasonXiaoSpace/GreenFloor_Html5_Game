///// <reference path="../global/ChainError.ts"/>

namespace vox.utils
{
	export class ArrayUtil
	{
		/**
		 * 简单数组乱序
		 * @param a array
		 */
		public static shuffle<T extends any[]>(a: T): T
		{
			let len: number = a.length;
			for (let i: number = 1; i < len; i++)
			{
				let end: number = len - i;
				let index: number = (Math.random() * (end + 1)) >> 0;
				let t: any = a[end];
				a[end] = a[index];
				a[index] = t;
			}
			return a;
		}

		/**
		 * 从数组指定范围内随机取出指定数量的不重复元素
		 * <listing version="3.0">
		 * ArrayUtils.randomize([0,1,2,3,4,5,6,7,8,9], 3, 2, 7);
		 * //返回[6,2,3]
		 * </listing>
		 * @param arr 		原始数组
		 * @param count	    数量，默认为范围内全部元素
		 * @param begin 	起始位置，默认为0
		 * @param end		结束位置，默认为数组长度
		 */
		public static randomize<T extends any[]>(arr: T, count?: number, begin?: number, end?: number): T
		{
			if (!arr || begin < 0) //throw new vox.global.ChainError("invalid argument");

			arr = arr.concat() as T;
			let len: number = arr.length;

			end = end >> 0;
			if (!(end >= 0 && end <= len))
			{
				end = len;
			}

			begin = begin >> 0;
			if (!(begin > 0))
			{
				begin = 0;
			}

			count = count >> 0;
			if (!(count >= 0 && count < end - begin))
			{
				count = end - begin;
			}

			let arr2: T = <T>[];
			let end2: number = begin + count;
			for (let i: number = begin; i < end2; i++)
			{
				let index: number = (Math.random() * (end - i) + i) >> 0;
				arr2[i - begin] = arr[index];
				arr[index] = arr[i];
			}

			return arr2;
		}
	}
}