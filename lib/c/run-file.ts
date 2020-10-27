import { Result, Options, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../box/util/helper";
import { compileC } from "./compile-file";
import { runExecutable } from "../executable/execute-executable";
import { C_Options } from "./c-options"

/**
 * Runs a C file on a given path and 
 * @param filePath A path like string
 * @param options
 * @param callback
 */
export function runCFile(filePath: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a C file on a given path and 
 * @param filePath A path like string
 * @param callback
 */
export function runCFile(filePath: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a C file on a given path and 
 * @param filePath A path like string
 * @param options
 */
export function runCFile(filePath: string, options?: Options): Promise<Result>;

export async function runCFile(filePath: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(filePath, runCFileAndReturnPromise, ...args);
}

export async function runCFileAndReturnPromise(filePath: string, options?: C_Options): Promise<Result> {
    try {
        let executablePath = await compileC(filePath, options);
        if (options && options.addressSanitizer){
            if(options.envVariables)
                options.envVariables.ASAN_OPTIONS = `log_path=${executablePath}.log`;
            else
                options.envVariables = { ASAN_OPTIONS : `log_path=${executablePath}.log` };
        }
        
        return runExecutable(executablePath, options).then( (res : Result) => {
                                                                res.files.push(filePath);
                                                                return res;
                                                            });
    }
    catch (err) {
        return err;
    }
};