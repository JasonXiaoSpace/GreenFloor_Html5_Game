namespace flow
{
    export interface ISubjectFlow
    {
        //数量
        getSubjectsNum():number ;
        getSubjectsNumInGroup():number ;
        setSubjectsNumInGroup( value:number ):void ;

        //序号
        getCurSubjectIndex():number ;
        getCurSubjectIndexInGroup():number ;
        getCurGroupIndex():number ;

        //vo
        getAllSubjects():ISubjectVO[];
        getCurSubject():ISubjectVO ;

        //状态
        getRunning():boolean ;

        //flow流程
        start( subjects:ISubjectVO[], responder:ISubjectFlowResponder, index?:number):void ;
        pause();
        resume();
        stop();

        //subject流程
        onSubjectFinish( isCorrect:boolean ):void;
        redoCurSubject():void
        getRedoTimes( subject:ISubjectVO ):void ;
    }
}