import { Options, Result, ErrorType } from "../types";
import { execute } from "../execute-command";

/**
 * Executes an executable
 * @param filePath A path like string
 * @param options 
 */
export async function runExecutable(filePath: string, options?: Options): Promise<Result> {
  let res = await execute(filePath, options);
  if (res.signal === 'SIGSEGV') { //probably seg fault and other memory/pagination issues
    res.errorType = ErrorType.RUN_TIME;
  }
  else if(res.signal === 'SIGTERM'){ //probably timeout or killed by SO somehow
    if(!res.errorType)
      res.errorType = ErrorType.RUN_TIME;
  }
  return res;
}