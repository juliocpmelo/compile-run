import { ErrorType } from "../types";
import { getFileName } from "../source-writer";
import { getExecutableExt } from "../executable/executable-ext";
import { tmpPath, checkExistsAndMakeDir } from "../init";
import path from 'path';
import { execute } from "../execute-command";
import { C_Options } from "./c-options"

/**
 * Compiles a C source file and returns a promise that resolves with the path of the executable
 * @param filePath A path like string
 * @param options Optional options
 */
export async function compileC(filePath: string, options?: C_Options): Promise<string> {
    let compileTimeout = options && options.compileTimeout || 3000;
    let executableExt = getExecutableExt();
    const compilationPath: string = options && options.compilerPath || 'gcc';
     
    let cPath = path.join(tmpPath, 'c');
    checkExistsAndMakeDir(cPath);
    let executableName = getFileName(executableExt);
    let executablePath = path.join(cPath, executableName);

    const compilerArgs: string[] = [filePath, '-o', executablePath, '-lm'];

    if(options && options.addressSanitizer){ //enables address sanitizer, works on both clang and gcc
        compilerArgs.concat(['-g', '-fsanitize=address']);
    }
    
    compilerArgs.concat(options && options.compilerArgs || []);
    
    let res = await execute(compilationPath, compilerArgs, { timeout: compileTimeout });
    if (res.exitCode !== 0) {
        res.errorType = ErrorType.COMPILE_TIME;
        throw res;
    }
    return executablePath;
}