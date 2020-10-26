export enum ErrorType{
    COMPILE_TIME = 'compile-time',
    RUN_TIME = 'run-time',
    PRE_COMPILE_TIME = 'pre-compile-time',
    RUN_TIMEOUT = 'run-timeout',
    RUN_STDOUT_OVERFLOW = 'run-stdout-overflow',
    RUN_STDERR_OVERFLOW = 'run-stderr-overflow'
}

export interface Result {
    stdout: string;
    stderr: string;
    exitCode: number;
    /**
     * Memory used by program in Bytes
     */
    memoryUsage: number;
    /**
     * CPU time by program in microseconds
     */
    cpuUsage: number;


    /** 
     * Signal resulting, if any, resulting from the code execution
    */
    signal: string;
    
    /**
     * file with debugger repport generated when executing programs
     */
    debuggerReportFile?: string;

    errorType?: ErrorType;
}
