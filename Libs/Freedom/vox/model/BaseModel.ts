namespace vox.model{
    import ApplicationContext = vox.context.ApplicationContext;
    import ContextManager = vox.external.ContextManager;
    export class BaseModel{
        private _context:ApplicationContext;

        public getContext():ApplicationContext{
            return this._context ;
        }

        public constructor(){
            this._context = ContextManager.context ;
        }

        protected dispatch( type:string, ...args):void

        protected dispatch( event:Event):void

        protected dispatch( typeOrEvent:any,...args ):void
        {
            args.unshift( typeOrEvent ) ;
            this._context.dispatch.apply( this._context, args ) ;
        }
    }
}