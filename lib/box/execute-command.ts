import { Options, Result, ErrorType } from "../types";
import { ChildProcess, spawn } from "child_process";
import path from 'path';

import { ResponseMessage, SandboxMessage } from './sanbox-messages'

/**
 * Execute a command taking spawn like arguments and returns a result promise
 * @param cmd 
 * @param args 
 * @param options
 */
export function execute(cmd: string, args: string[], options?: Options): Promise<Result>;

/**
 * Execute a command taking spawn like arguments and returns a result promise
 * @param cmd 
 * @param options
 */
export function execute(cmd: string, options?: Options): Promise<Result>;

/**
 * Execute a command taking spawn like arguments and returns a result promise
 * @param cmd 
 * @param args 
 */
export function execute(cmd: string, args?: string[]): Promise<Result>;

export function execute(cmd: string, ...args: any[]): Promise<Result> {

    let options : any;
    return new Promise((res, rej) => {
        let p: ChildProcess;
        let arr: string[] | undefined = undefined;
        if (args[0] && args[0] instanceof Array) {
            
            arr = args[0];
            //console.log(`arguments ${arr}`)
            if (args[1] && typeof args[1] === 'object') {
                options = args[1];
            }
        }
        else if (args[0] && typeof args[0] === 'object') {
            options = args[0];
        }
        /*defaults or sent by options*/
        let timeout = options.timeout || 3000;
        let stdin = options.stdin || '';
        let stderrLimit = options.stderrLimit || 1000;
        let stdoutLimit = options.stdoutLimit || 1000;
        let envVariables = options.envVariables || [];

        p = spawn('node', [path.join(__dirname, '.')], {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc']
        });

        let msg : SandboxMessage = {
            cmd : cmd,
            arguments : arr,
            timeout : timeout,
            stdin : stdin,
            stderrLimit : stderrLimit,
            stdoutLimit : stdoutLimit,
            envVariables : envVariables
        };
        
        

        p.send(msg);
        p.on('message', (msg: ResponseMessage) => {
            if (msg.status == 'success') {
                if(msg.executionResult)
                    res(msg.executionResult);
                else{
                    let errorRes:Result;
                    errorRes ={
                        files: [],
                        memoryUsage: 0,
                        cpuUsage:0,
                        stdout: '',
                        stderr: 'The runner returned a Null Result',
                        signal: '',
                        exitCode: 3,
                        errorType: ErrorType.RUN_TIME
                    }
                    res(errorRes);
                }
            }
            else {
                rej(msg.error);
            }
            p.kill();
        });
    });
}
