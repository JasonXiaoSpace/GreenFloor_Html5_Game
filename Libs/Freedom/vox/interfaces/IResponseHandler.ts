namespace vox.intefaces
{
    import BaseMessageType = vox.net.BaseMessageType;
    export interface IResponseHandler
    {
        ( responseOrError ?:BaseMessageType,request?)
    }
}