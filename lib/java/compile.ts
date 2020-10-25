import { ErrorType } from "../types";
import { execute } from '../box/execute-command';
import path from 'path';
import { Java_Options } from "./java-options";


/**
 * Compiles a file at some path
 * @param filePath A path like string
 * @param options 
 */
export async function compileJava(filePath: string, options?: Java_Options): Promise<string> {
    filePath = path.resolve(filePath);
    const compilationPath: string = options && options.compilerPath || 'javac';
    let res = await execute(compilationPath, [filePath], {
        timeout: options && options.compileTimeout || 3000
    });

    if (res.exitCode !== 0) {
        res.errorType = ErrorType.COMPILE_TIME;
        throw res;
    }
    let basename = path.basename(filePath);
    let dirPath = path.dirname(filePath);
    let [fileBaseName] = basename.split('.');
    let classFilePath = path.join(dirPath, `${fileBaseName}.class`);
    return classFilePath;
}