import { Result, Options, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../box/util/helper";

import { writeSourceFile } from "../source-writer";
import { runCppFile } from './run-file';

/**
 * Runs a Cpp source code provided as string
 * @param sourceCode source string to be executed
 * @param options
 * @param callback
 */
export function runCppSource(sourceCode: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a C source code provided as string
 * @param sourceCode source string to be executed
 * @param callback
 */
export function runCppSource(sourceCode: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a C source code provided as string
 * @param sourceCode source string to be executed
 * @param options
 */
export function runCppSource(sourceCode: string, options?: Options): Promise<Result>;

export async function runCppSource(sourceCode: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(sourceCode, runCppSourceAndReturnPromise, ...args);
}

export async function runCppSourceAndReturnPromise(sourceCode: string, options?: Options): Promise<Result> {
    try {
        let filePath = await writeSourceFile('cpp', sourceCode);
        return runCppFile(filePath, options);
    }
    catch (err) {
        return err;
    }
}