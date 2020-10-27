import { ErrorType } from "../types";
import { getFileName } from "../source-writer";
import { getExecutableExt } from "../executable/executable-ext";
import { tmpPath, checkExistsAndMakeDir } from "../init";
import path from 'path';
import { execute } from "../box/execute-command";
import { CPP_Options } from "./cpp-options";

/**
 * Compiles a Cpp source file and returns a promise that resolves with the path of the executable
 * @param filePath A path like string
 * @param options Optional options
 */
export async function compileCpp(filePath: string, options?: CPP_Options): Promise<string> {
    let compileTimeout = options && options.compileTimeout || 3000;
    let executableExt = getExecutableExt();
    const compilationPath: string = options && options.compilerPath || 'g++';
    let cppPath = path.join(tmpPath, 'cpp');
    checkExistsAndMakeDir(cppPath);
    let executableName = getFileName(executableExt);
    let executablePath = path.join(cppPath, executableName);

    let compilerArgs: string[] = [filePath, '-o', executablePath];

    if(options && options.addressSanitizer){ //enables address sanitizer, works on both clang and gcc
        compilerArgs = compilerArgs.concat(['-g', '-fsanitize=address']);
    }
    
    compilerArgs = compilerArgs.concat(options && options.compilerArgs ? options.compilerArgs : []);

    let res = await execute(compilationPath, compilerArgs, { timeout: compileTimeout });
    if (res.exitCode !== 0) {
        res.errorType = ErrorType.COMPILE_TIME;
        throw res;
    }
    return executablePath;
}