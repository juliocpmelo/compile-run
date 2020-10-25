import { errorResultCallback, Result, ErrorType } from "../types";
import path from 'path';
import { multipleArgsCallbackifier } from "../helper";
import { execute } from "../execute-command";
import { Node_Options } from "./node-options";

/**
 * executes the javascript source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param options Options object
 * @param callback Optional callback
 */
export function runNodeFile(filePath: string, options: Node_Options, callback: errorResultCallback): Promise<Result>;

/**
 * executes the javascript source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param callback Optional callback
 */
export function runNodeFile(filePath: string, callback: errorResultCallback): Promise<Result>;

/**
 * executes the javascript source code in the file at the path provided and give stdout and stderr as result
 * @param path A path like string
 * @param options Options object
 */
export function runNodeFile(filePath: string, options?: Node_Options): Promise<Result>;

export async function runNodeFile(filePath: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(filePath, runNodeFileAndReturnPromise, ...args);
}

/**
 * Core function to handle program execution
 * @param filePath A path like string
 * @param options 
 */
async function runNodeFileAndReturnPromise(filePath: string, options?: Node_Options): Promise<Result> {
    //Make the path absolute
    filePath = path.resolve(filePath);
    const executionPath = options && options.executionPath || 'node';
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