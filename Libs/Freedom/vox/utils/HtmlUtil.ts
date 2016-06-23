namespace vox.utils
{
    export class HtmlUtil
    {
        public static clearChildren( node:HTMLElement ):void
        {
            for( var i:number = 0, len:number = node.childElementCount ; i < len ; i++)
            {
                node.removeChild( node.firstChild ) ;
            }
        }
    }
}