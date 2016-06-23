namespace flow
{
    /**5分钟*/
    export interface ISubjectFlowResponder
    {
        onFlowStart( subjects:SubjectVO[], cbk:()=>void ):void ;

        onGroupStart( subjectsInGroup:SubjectVO[], cbk:()=>void ):void ;

        onSubjectStart( subject:SubjectVO, cbk:()=>void ):void ;

        /**时间默认都是毫秒*/
        onSubjectTick( subject:SubjectVO, delta:number, leftTime:number ):void ;

        onSubjectTickOver( subject:SubjectVO, cbk:()=>void ):void ;

        onSubjectEnd( subject:SubjectVO, cbk:()=>void ):void ;

        onGroupEnd( subjects:SubjectVO[], cbk:()=>void ):void ;

        onFlowEnd( subjects:SubjectVO[], cbk:()=>void ):void ;
    }
}