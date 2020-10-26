import { runCFile } from './run-file';
import { runCSource } from './run-source';
import { C_Options } from './c-options'



const c = {
    runFile: runCFile,
    runSource: runCSource
};

export { c, C_Options };
