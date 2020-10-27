
import { spawn, ChildProcess } from 'child_process';
import { writeToStdin } from './util/sdtin-write';
import { streamDataToString } from './util/stream-to-string';
import { Result, ErrorType } from '../types';
import { SandboxMessage, ResponseMessage } from './sanbox-messages';
import { inspect } from 'util';

import { existsSync } from 'fs';



// When it receives a message about what command to execute it executes it and returns the result
process.on('message', (msg: SandboxMessage) => {
    let initialCPUUsage = process.cpuUsage();
    let initialMemUsage = process.memoryUsage();
    //console.log(`running ${msg.cmd} with ${msg.arguments}`);
    //console.log(`env ${inspect(msg.envVariables)}`);
    let processEnv = process.env;

    processEnv = Object.assign(processEnv, msg.envVariables);


    let cp: ChildProcess = spawn(msg.cmd, msg.arguments, {env: processEnv});
    

    //write to stdin
    writeToStdin(cp, msg.stdin);
    
    let resultPromise: Promise<string>[] = [];
    resultPromise.push((streamDataToString(cp.stderr)));
    resultPromise.push(streamDataToString(cp.stdout));
    let pr = Promise.all(resultPromise);
    let stdoutSize = 0, stdoutErrSize = 0;
    let errorType : ErrorType | undefined = undefined;

    let killTimerId = setTimeout(() => {
        cp.kill('SIGKILL');
        errorType = ErrorType.RUN_TIMEOUT;
    }, msg.timeout);
    cp.stdout.on('data', (data : string) => {
        stdoutSize += data.length;
        if(stdoutSize > msg.stdoutLimit){
            cp.kill('SIGKILL');
            errorType = ErrorType.RUN_STDOUT_OVERFLOW;
        }
    });
    cp.stderr.on('data', (data : string) => {
        stdoutErrSize += data.length;
        if(stdoutErrSize > msg.stderrLimit){
            cp.kill('SIGKILL');
            errorType = ErrorType.RUN_STDERR_OVERFLOW;
        }
    });
    cp.on('close', (exitCode,signal) => {
        let memUsage = process.memoryUsage();
        pr
            .then((result: string[]) => {
                clearTimeout(killTimerId);
                return result;
            })
            .then((result: string[]) => {
                let debuggerReportFile : string | undefined = `${msg.cmd}.log.${cp.pid}`;
                if(!existsSync(debuggerReportFile)){
                    debuggerReportFile = undefined;
                }
                else if(!errorType){
                    errorType = ErrorType.RUN_TIME;
                }
                
                let res : Result = {
                    stderr: result[0].slice(0,msg.stderrLimit),
                    stdout: result[1].slice(0,msg.stdoutLimit),
                    exitCode: exitCode,
                    signal: signal,
                    debuggerReportFile: debuggerReportFile,
                    memoryUsage: memUsage.rss - initialMemUsage.rss,
                    cpuUsage: process.cpuUsage(initialCPUUsage).user,
                    errorType : errorType,
                    files : []
                }
                //console.log('error type ' + cp.pid + ' - ' + errorType);
                return res;
            })
            .then((result: Result) => {

                let response : ResponseMessage = {
                    status: 'success',
                    executionResult: result
                }
                process.send && process.send(response);
            })
            .catch(err => {
                let response : ResponseMessage = {
                    status: 'error',
                    error: err
                }
                process.send && process.send(response);
                clearTimeout(killTimerId);
            });
    });
});
