/// <reference path="../utils/LogUtil.ts"/>
/// <reference path="../utils/URLUtil.ts"/>

namespace vox.utils
{
    export class HtmlUtil
    {
        /**
         * 清理节点的所有子节点
         * @param node 要清理的节点
         */
        public static clearChildren(node:HTMLElement):void
        {
            for(var i:number = 0, len:number = node.childElementCount; i < len; i++)
            {
                node.removeChild(node.firstChild);
            }
        }

        /**
         * 获取指定js的基础路径
         * 如，"http://a/b/c.min.js"，返回"http://a/b/"
         * @param name      js文件名（如"examcore"）
         */
        public static getJsPath(name: string): string
        {
            let re: RegExp = new RegExp(name + "(-[0-9a-f]{10})?(\\.min)?\\.js(.*?)$", "i");
            let scripts: JQuery = $("script");
            for (let i: number = 0, len: number = scripts.length; i < len; i++)
            {
                let path: string = $(scripts[i]).attr('src');
                if (re.test(path))
                {
                    path = vox.utils.URLUtil.trimURL(path);
                    path = path.substr(0, path.lastIndexOf("/") + 1);
                    return path;
                }
            }
            return null;
        };

        /**
         * 加载模板
         * @param tplList
         * @param onSuccess
         * @param onError
         */
        public static loadTpl(tplList: (string | string[])[], onSuccess: () => void, onError: (htmlName: string) => void): void
        {
            if (!tplList)
            {
                if (onError) onError(null);
                return;
            }

            let $head: JQuery = $("head");
            let htmlList: string[] = [];
            tplList.forEach(function (tpl: string | string[]): void
            {
                if (!tpl) return;
                if ($.isArray(tpl))
                {
                    htmlList = htmlList.concat(tpl as string[]);
                } else
                {
                    $head.append(String(tpl));
                }
            });

            next();

            function next(): void
            {
                if (!htmlList.length)
                {
                    if (onSuccess) onSuccess();
                    return;
                }

                let htmlName: string = htmlList[htmlList.length - 1];
                vox.utils.LogUtil.log("【本地加载tpl.html】： " + htmlName);
                $.get(htmlName)
                    .then(function doneCallback(data: any, textStatus: string, jqXHR: JQueryXHR): void
                        {
                            $head.append(data);
                            htmlList.length = htmlList.length - 1;
                            next();
                        },
                        function failCallback(jqXHR: JQueryXHR, textStatus: string, errorThrown: any): void
                        {
                            vox.utils.LogUtil.log("html模板加载失败：" + htmlName, vox.utils.LogLevel.ERR);
                            if (onError) onError(htmlName);
                        }
                    );
            }

        }
    }
}