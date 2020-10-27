import { Result, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../box/util/helper";
import { compileCpp } from "./compile-file";
import { runExecutable} from "../executable/execute-executable";

import { CPP_Options } from "./cpp-options";


/**
 * Runs a Cpp file on a given path and 
 * @param filePath A path like string
 * @param options
 * @param callback
 */
export function runCppFile(filePath: string, options: CPP_Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Cpp file on a given path and 
 * @param filePath A path like string
 * @param callback
 */
export function runCppFile(filePath: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a Cpp file on a given path and 
 * @param filePath A path like string
 * @param options
 */
export function runCppFile(filePath: string, options?: CPP_Options): Promise<Result>;

export async function runCppFile(filePath: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(filePath, runCppFileAndReturnPromise, ...args);
}

export async function runCppFileAndReturnPromise(filePath: string, options?: CPP_Options): Promise<Result> {
    try {
        let executablePath = await compileCpp(filePath, options);

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
}