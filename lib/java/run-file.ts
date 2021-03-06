import { Result, ErrorType, Options, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../box/util/helper";
import { compileJavaFile } from "./compile-file";
import { execute } from "../box/execute-command";
import path from 'path';
import { Java_Options } from ".";

/**
 * Runs a Java file on a given path and 
 * @param filePath A path like string
 * @param options
 * @param callback
 */
export function runJavaFile(filePath: string, options: Java_Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Java file on a given path and 
 * @param filePath A path like string
 * @param callback
 */
export function runJavaFile(filePath: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Java file on a given path and 
 * @param filePath A path like string
 * @param options
 */
export function runJavaFile(filePath: string, options?: Java_Options): Promise<Result>;

export async function runJavaFile(filePath: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(filePath, runJavaFileAndReturnPromise, ...args);
}

export async function runJavaFileAndReturnPromise(filePath: string, options?: Java_Options): Promise<Result> {
    try {
        let classFilePath = await compileJavaFile(filePath, options);
        let classPath = path.dirname(classFilePath);
        let [className] = path.basename(classFilePath).split('.');
        const executionPath = options && options.executionPath || 'java';
        let res = await execute(executionPath, ['-classpath', classPath, className], options);
        if(res.signal === 'SIGTERM'){ //probably timeout or killed by SO somehow
            if(!res.errorType)
                res.errorType = ErrorType.RUN_TIME;
        }
        else if (res.signal === 'SIGSEGV') { //probably seg fault and other memory/pagination issues
            res.errorType = ErrorType.RUN_TIME;
        }
        return res;
    }
    catch (err) {
        return err;
    }
}