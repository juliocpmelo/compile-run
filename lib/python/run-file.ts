import { errorResultCallback, Result, ErrorType } from "../types";
import path from 'path';
import { multipleArgsCallbackifier } from "../box/util/helper";
import { execute } from "../box/execute-command";
import { Python_Options } from "./python-options";

/**
 * executes the python source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param options Optional Options obj
 * @param callback Optional callback
 */
export function runPythonFile(filePath: string, options: Python_Options, callback: errorResultCallback): Promise<Result>;

/**
 * executes the python source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param options Optional Options obj
 */
export function runPythonFile(filePath: string, options?: Python_Options): Promise<Result>;

/**
 * executes the python source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param callback Optional callback
 */
export function runPythonFile(filePath: string, callback: errorResultCallback): Promise<Result>;

export async function runPythonFile(filePath: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(filePath, runPythonFileAndReturnPromise, ...args);
}

/**
 * Core function to handle program execution
 * @param filePath A path like string
 * @param options 
 */
async function runPythonFileAndReturnPromise(filePath: string, options?: Python_Options): Promise<Result> {
    //Make the path absolute
    filePath = path.resolve(filePath);
    const executionPath = options && options.executionPath || 'python';
    let res = await execute(executionPath, [filePath], options);
    if(res.signal === 'SIGTERM'){ //probably timeout or killed by SO somehow
        if(!res.errorType)
            res.errorType = ErrorType.RUN_TIME;
    }
    else if (res.signal === 'SIGSEGV') { //probably seg fault and other memory/pagination issues
        res.errorType = ErrorType.RUN_TIME;
    }
    return res;
}
