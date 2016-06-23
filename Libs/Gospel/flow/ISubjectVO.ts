namespace flow
{
    export interface ISubjectVO
    {
        /***/
        id:string;
        /***/
        type:string;
        /**规定的时间 单位是秒*/
        givenTime?:number;
        /**用户是否做对*/
        isCorrect?:boolean ;
        /**用户花的时长*/
        durationMS?:number ;
    }
}