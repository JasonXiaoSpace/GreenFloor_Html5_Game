namespace vox.enums{
    export class ErrorCode{
        public static UNCAUGHT_ERROR: string = "50000";
        public static HTTP_REQUEST_ERROR: string = "50001";
        public static HTTP_REQUEST_TIMEOUT: string = "50002";
        public static JSON_STRINGIFY_ERROR: string = "50003";
        public static JSON_PARSE_ERROR: string = "50004";
        public static COOKIE_INVALID: string = "50005";
        public static LOAD_IMAGE_ERROR: string = "50006";
        public static LOAD_AUDIO_ERROR: string = "50007";
        public static UPLOAD_ERROR: string = "50008";
        public static UPLOAD_TIMEOUT: string = "50009";
        public static INIT_PARAMS_NO_DOMAIN: string = "50100";
        public static INIT_PARAMS_NO_IMG_DOMAIN: string = "50101";
        public static INIT_PARAMS_NO_HW_PRACTICE_URL: string = "50102";
        public static GET_FLASHVARS_ERROR: string = "50110";
        public static ALTERNATE_CDN_ERROR: string = "50111";
        public static EXAM_PARAMS_ERROR: string = "51000";
        public static EXAM_GET_PAPER_ERROR: string = "51001";
        public static EXAM_GET_QUESTION_ERROR: string = "51002";
        public static EXAM_GET_ANSWER_ERROR: string = "51003";
        public static EXAM_SUBMIT_ERROR: string = "51004";
        public static EXAM_GET_QUESTION_MISSING: string = "51005";
        public static EXAM_SUB_QUESTION_DATA_ERROR: string = "51006";
        public static EXAM_QUESTION_DATA_ERROR: string = "51007";
        public static EXAM_SUPER_QUESTION_DATA_ERROR: string = "51008";
        public static LOAD_HTML_TPL_ERROR: string = "51010";
        public static FIND_HTML_TPL_FAIL: string = "51011";
        public static HOMEWORK_GET_QUESTION_ERROR: string = "52001";
        public static HOMEWORK_NO_VALID_QUESTION: string = "52002";
        public static HOMEWORK_SUBMIT_ERROR: string = "52003";
        public static HOMEWORK_GET_RESULT_ERROR: string = "52004";
        public static HOMEWORK_GET_PRACTICE_DETAIL_ERROR: string = "52008";
        public static HOMEWORK_INVALID_PRACTICE_DATA: string = "52009";
        public static HOMEWORK_GET_PRACTICE_LIST_ERROR: string = "52010";
        public static HOMEWORK_INVALID_PRACTICE_LIST_DATA: string = "52011";
        public static HOMEWORK_INVALID_INIT_PARAMS: string = "52012";
        public static HOMEWORK_INVALID_INIT_PARAMS_PRACTICE_LIST: string = "52013";

    }
}