namespace vox.command{
    import IModule = vox.module.IModule;
    export class ChangeModuelCommand extends BaseCommand{
        public exec():void
        {
            var module:IModule = this.parameters[0];
            if( module != null ){
                window.location.hash = "#" + module.getName() ;
            }
        }
    }
}