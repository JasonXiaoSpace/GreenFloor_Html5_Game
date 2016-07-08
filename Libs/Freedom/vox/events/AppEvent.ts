namespace vox.events{
    export class AppEvent
    {
        public static Evt_App_Initialized             :string = "Evt_App_Initialized";
        public static Evt_Framework_Initialized       :string = "Evt_Framework_Initialized" ;
        public static Evt_Init_Request_Completed      :string = "Evt_Init_Request_Completed";

        public static Evt_Get_Server_Response         :string = "Evt_Get_Server_Response" ;
        /**请求错误事件*/
        public static Evt_Request_ErrorEvent          :string = "Evt_Request_ErrorEvent" ;


        public static Evt_PreChangeModule             :string = "Evt_PreChangeModule";
        public static Evt_ChangeModule                :string = "Evt_ChangeModule" ;
        public static Evt_StartLoadModule             :string = "Evt_StartLoadModule" ;
        public static Evt_LoadModuleComplete          :string = "Evt_LoadModuleComplete" ;
        public static Evt_LoadModuleFail              :string = "Evt_LoadModuleFail" ;
    }
}