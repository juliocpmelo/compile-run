import { Options, Result, ErrorType } from "../types";
import { execute } from "../execute-command";

/**
 * Executes an executable
 * @param filePath A path like string
 * @param options 
 */



/*
* runs c or cpp compiled files with valgrind and produce a xml output
*/
export async function runExecutableWithDebugger(filePath: string, options?: Options): Promise<Result> {
  
  /*
  let cmd : string = 'gdb'
  let args: string[] = ['-batch','-ex','set confirm off','-ex','handle SIGINT stop print pass','-ex', 'run', '-ex', 'bt', '-ex', 'p $_siginfo', filePath];
  */
  let cmd : string = 'valgrind';
  let repportFile = `${filePath}.valgrind.xml`;
  let args: string[] = ['--leak-check=full', '-q', '--xml=yes', `--xml-file=${repportFile}`, filePath];

  let res = await execute(cmd, args, options);
  
  if (res.signal === 'SIGSEGV') { //probably seg fault and other memory/pagination issues
    res.errorType = ErrorType.RUN_TIME;
  }
  else if(res.signal === 'SIGTERM'){ //probably timeout or killed by SO somehow
    if(!res.errorType)
      res.errorType = ErrorType.RUN_TIME;
  }
  res.debuggerReportFile = repportFile;

  return res;
}


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