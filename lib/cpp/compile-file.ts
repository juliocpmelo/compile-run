import { Options, ErrorType } from "../types";
import { getFileName } from "../source-writer";
import { getExecutableExt } from "../executable/executable-ext";
import { tmpPath, checkExistsAndMakeDir } from "../init";
import path from 'path';
import { execute } from "../execute-command";

/**
 * Compiles a Cpp source file and returns a promise that resolves with the path of the executable
 * @param filePath A path like string
 * @param options Optional options
 */
export async function compileCpp(filePath: string, options?: Options): Promise<string> {
    let compileTimeout = options && options.compileTimeout || 3000;
    let executableExt = getExecutableExt();
    const compilationPath: string = options && options.compilationPath || 'g++';
    const compilerArgs: string = options && options.compilerArgs || '-lm';
    let cppPath = path.join(tmpPath, 'cpp');
    checkExistsAndMakeDir(cppPath);
    let executableName = getFileName(executableExt);
    let executablePath = path.join(cppPath, executableName);
    let res = await execute(compilationPath, [filePath, '-o', executablePath, compilerArgs, '-g', '-O0'], { timeout: compileTimeout });
    if (res.exitCode !== 0) {
        res.errorType = ErrorType.COMPILE_TIME;
        throw res;
    }
    return executablePath;
}