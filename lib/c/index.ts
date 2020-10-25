import { runCFile } from './run-file';
import { runCSource } from './run-source';
import { C_Options } from './c-options'

export { C_Options };

const c = {
    runFile: runCFile,
    runSource: runCSource
};

export default c;
