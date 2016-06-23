namespace flow{
    export class DefaultSubjectFlow implements ISubjectFlow
    {
        private _subjectsNum            :number ;
        private _curSubjectIndex        :number;
        private _allSubjects            :ISubjectVO[];

        private _running                :boolean ;
        private _responder              :ISubjectFlowResponder ;

        private _numPerGroup            :number = 0 ;//每组里有多少题

        //关于时间
        private _startTime              :number ;
        private _lastTime               :number ;
        private _pauseTime              :number ;
        private _pauseDuration          :number ;
        private _givenTime              :number ;

        private _redoCountDict          :{[id:string]:number} ;

        //数量
        public getSubjectsNum():number {
            return this._subjectsNum ;
        }

        public getSubjectsNumInGroup():number{
            return this._perNumPerGroup ;
        }

        public setSubjectsNumInGroup( value:number ):void{
            if( value < 0 ) return 0 ;
            this._perNumPerGroup = value ;
        }

        public getGroupNum():number{
            if( this._numPerGroup <= 0 ) return ;
            var reminder:number = this.getSubjectsNum() % this._numPerGroup ;
            var quotient:number = this.getSubjectsNum() / this._numPerGroup ;
            return reminder != 0 ? (quotient + 1) : quotient ;
        }


        //序号
        public getCurSubjectIndex():number{
            return this._curSubjectIndex ;
        }

        public getCurSubjectIndexInGroup():number{
            if( this._perNumPerGroup == 0 ) return this._curSubjectIndex ;
            return Math.floor( this._curSubjectIndex % this._perNumPerGroup ) ;
        }

        public getCurGroupIndex():number{
            if( this._perNumPerGroup == 0 ) return 0 ;
            return Math.floor( this._curSubjectIndex / this._perNumPerGroup ) ;
        }

        //vo
        public getAllSubjects():ISubjectVO[]{
            return this._allSubjects ;
        }

        public getCurSubject():ISubjectVO{
            return this._allSubjects[ this._curSubjectIndex ] ;
        }

        public getSubjectsInCurGroup():ISubjectVO[]{
            var startIndex:number = this.getCurGroupIndex() * this._numPerGroup ;// 当前组的第一个元素在all中的序号
            var endIndex:number ;
            if( this.getCurGroupIndex() != getGroupNum() - 1 ){//如果当前组不是最后一个组
                endIndex = ( this.getCurGroupIndex() + 1 ) * this._numPerGroup - 1 ;
            }else{
                endIndex = this.getSubjectsNum() - 1 ;
            }
            var subjects:ISubjectVO[] = this.getAllSubjects().slice( startIndex, endIndex + 1 ) ;
        }


        //状态
        public getRunning():boolean{
            return this._running ;
        }

        //开始 flow流程，这是总的开始方法
        public  start( subjects:ISubjectVO[], responder:ISubjectFlowResponder, index?:number):void{
            //首先停止现有流程 todo
            this.stop();

            this._allSubjects = subjects ;
            this._responder = responder ;
            this._subjectsNum = this._allSubjects.length ;
            this._redoCountDict = {} ;

            if( this._subjectsNum > 0 ){
                if( index < 0 ){
                    index = 0 ;
                }else if( index > this._subjectsNum ){
                    index = this._subjectsNum - 1 ;
                }
                this._curSubjectIndex = index - 1 ;//这里不一定对
            }else{
                this._curSubjectIndex = -1 ;
            }

            //设置标记
            this._running = true ;
            //调用流程开始回调
            if( this._responder != null && this._responder.onFlowStart != null ){
                this._responder.onFlowStart( this._allSubjects, this.nextSubject ) ;
            }else{
                this.nextSubject() ;
            }
        }

        public  pause():void{
            if( this._running ){
                ticker.ticker.remove( this.onTicker, this ) ;//如何访问 ticker.ticker 的?
                this._running = false ; //设置running的状态
                this._pauseTime = new Date().getDate() ; //记录暂停时刻
            }
        }

        public  resume():void{
            if( !this._running){
                var delta:number = new Date().getTime() - this._pauseTime ;//记录暂停间隔时间
                this._pauseDuration += delta ; //记录累计暂停时长
                this._lastTime += delta ;//将上一次Tick的时刻向后推移 不懂
                ticker.ticker.add( this.onTicker, this ) ;
                this._running = true ;
            }
        }

        public  stop():void{
            this.pause() ;
            this._curSubjectIndex = 0 ;
            this._startTime = 0 ;
            this._lastTime = 0 ;
            this._pauseTime = 0 ;
            this._pauseDuration = 0 ;
            this._givenTime = 0 ;
        }

        //subject 时间到了其实并不意味着题一定做错，因为这些isCorrect不是合适的写法
        public onSubjectFinish( isCorrect:boolean ):void{
            if( this._running ){
                ticker.ticker.remove( this.onTicker, this ) ;
                var curSubject:ISubjectVO = this.getCurSubject() ;
                if( curSubject != null ){
                    curSubject.isCorrect = isCorrect ;
                    curSubject.durationMS = new Date().getTime() - this._startTime - this._pauseDuration ;
                }
                this.nextSubject() ;
            }
        }

        public redoCurSubject():void{
            if( this._running ){
                //增加重做次数
                var vo:ISubjectVO = this.getCurSubject() ;
                this._redoCountDict[ vo.id ] = this.getRedoTimes( vo ) + 1 ;//这步有点弱智
                //重做当前题
                this.startCurSubject() ;
            }
        }


        public constructor()
        {

        }

        /**准备跳到下一题*/
        private nextSubject():void
        {
            if( this._curSubjectIndex >= 0 ){
                if( this._responder != null && this._responder.onSubjectEnd != null ){
                    this._responder.onSubjectEnd( this.getCurSubject(), judgeGroupEnd.bind(this) ) //先执行当前题的 onSubjectEnd
                }else{
                    this.judgeGroupEnd().bind( this ) ;
                }
            }else{
                this.judgeGroupEnd().bind( this ) ;
            }
        }

        private judgeGroupEnd():void
        {
            if( this._numPerGroup > 0 && this._curSubjectIndex >= 0 && this.getCurSubjectIndexInGroup() == this._numPerGroup - 1 ){
                if( this._responder != null && this._responder.onGroupEnd != null ){
                    this._responder.onGroupEnd( this.getSubjectsInCurGroup(), this.judgeFlowEnd ) ;
                }else{
                    this.judgeFlowEnd() ;
                }
            }else{
                this.judgeFlowEnd() ;
            }
        }

        private judgeFlowEnd():void
        {
            if( this._curSubjectIndex >= this.getSubjectsNum() - 1 ){
                this.allOver();
            }else{
                this._curSubjectIndex ++ ;
                if( this.getSubjectsNumInGroup() > 0 && this.getCurSubjectIndexInGroup() == 0 ){//如果本组题目个数大于0，且当前是在组内第一个
                    if( this._responder != null && this._responder.onGroupStart!= null ){
                        this._responder.onGroupStart( this.getSubjectsInCurGroup(), this.startCurSubject ) ;
                    }else{
                        this.startCurSubject() ;
                    }
                }else{
                    this.startCurSubject() ;
                }
            }
        }

        private startCurSubject():void{
            var self:DefaultSubjectFlow = this ;
            if( this._responder != null && this._responder.onSubjectStart!=null && this.getCurSubject()!= null){
                this._responder.onSubjectStart( this.getCurSubject(), this.startTimer ) ;
            }else{
                this.startTimer.call( this ) ;
            }

            function startTimer():void{
                if( self.getCurSubject().givenTime() > 0 ){
                    //启动计时器
                    self._startTime = self._lastTime = new Date().getTime() ;
                    self._givenTime = self.getCurSubject().givenTime ;
                    ticker.ticker.add( self.onTicker, self ) ;
                }
            }
        }

        private onTicker( deltaTime:number ):void{
            var curTime:number = new Date().getTime() ;
            var delta:number = curTime - this._lastTime ;//与上一次ticker时间间隔
            this._lastTime = curTime ;
            var passTime:number = curTime - this._startTime - this._pauseDuration ;//玩游戏所花的真实时长
            var curSubject:ISubjectVO = this.getCurSubject() ;
            var leftTime:number = this._givenTime - passTime ;
            if( leftTime < 0 ) leftTime = 0 ;
            //调用Ticker回调
            if( this._responder != null && this._responder.onSubjectTick != nulll ){
                this._responder.onSubjectTick(( curSubject, delta, leftTime ) ) ;
            }
            if( leftTime == 0 ) {
                ticker.ticker.remove( this.onTicker, this ) ;
                if( this._responder != null && this._responder.onSubjectTickOver != null ){
                    this._responder.onSubjectTickOver( curSubject, ()=>{
                        this.onSubjectFinish( false );
                    })
                }else{
                    this.onSubjectFinish( false ) ;
                }
            }
        }

        private allOver():void{
            if( this._responder != null && this._responder.onFlowEnd != null ){
                this._responder.onFlowEnd( this._allSubjects ) ;
            }
            this.stop() ;
        }

        public getRedoTimes( vo:ISubjectVO ):number{
            return Math.floor( this._redoCountDict[ vo.id ] ) ;
        }


    }
}