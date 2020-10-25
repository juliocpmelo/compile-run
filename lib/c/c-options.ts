import {Options} from '../types/interfaces/options'

export interface C_Options extends Options{

    compileTimeout?: number;

    /*
    * Set to true if you want to run with debugger. Debugger will produce the debuggerReportFile in the results object
    * runners have to process the repport accordingly. In this case, the repport will be made by cland Address Sanitizer
    */
    addressSanitizer?: boolean;

    /**
     * Set or compiler args if necessary for the specific language
     */
    compilerArgs?: string[];

    /**
     * Path to the compiler path gcc's or clang
     * 
     * can be a path like string to the compiler or custom command name whose path is already set
     */
    compilerPath?: string;

}
