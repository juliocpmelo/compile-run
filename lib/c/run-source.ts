import { Result, Options, errorResultCallback } from "../types";
import { multipleArgsCallbackifier } from "../box/util/helper";
import { writeSourceFile } from "../source-writer";
import { runCFile } from './run-file';

/**
 * Runs a C source code provided as string
 * @param sourceCode source string to be executed
 * @param options
 * @param callback
 */
export function runCSource(sourceCode: string, options: Options, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a C source code provided as string
 * @param sourceCode source string to be executed
 * @param callback
 */
export function runCSource(sourceCode: string, callback: errorResultCallback): Promise<Result>;

/**
 * Runs a C source code provided as string
 * @param sourceCode source string to be executed
 * @param options
 */
export function runCSource(sourceCode: string, options?: Options): Promise<Result>;

export async function runCSource(sourceCode: string, ...args: any[]): Promise<Result> {
    return multipleArgsCallbackifier<Result>(sourceCode, runCSourceAndReturnPromise, ...args);
}

export async function runCSourceAndReturnPromise(sourceCode: string, options?: Options): Promise<Result> {
    try {
        let filePath = await writeSourceFile('c', sourceCode);
        return runCFile(filePath, options);
    }
    catch (err) {
        return err;
    }
}