namespace vox.intefaces
{
    import BaseMessageType = vox.net.BaseMessageType;
    export  interface ResponseHandler
    {
        ( responseOrError ?:BaseMessageType,request?)
    }
}