import { Result, ErrorType } from "../types";
import { execute } from "../box/execute-command";
import { C_Options } from "../c";
import { CPP_Options } from "../cpp";

const fs = require ("fs");


/**
 * Executes an executable
 * @param filePath A path like string
 * @param options 
 */


export async function runExecutable(filePath: string, options?: C_Options | CPP_Options): Promise<Result> {
  
  let res = await execute(filePath, options);
  
  if(res.signal === 'SIGKILL'){ //probably timeout or killed by SO somehow (e.g timeout, bufferoverflow and others)
    if(!res.errorType)
      res.errorType = ErrorType.RUN_TIME;
  }
  else if(res.signal){ //probably seg fault and other memory/pagination issues (e.g 'SIGSEGV' and others)
    res.errorType = ErrorType.RUN_TIME;
  }

  return res;
}