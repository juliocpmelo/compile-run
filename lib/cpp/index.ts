import { runCppFile } from './run-file';
import { runCppSource } from './run-source';

import { CPP_Options } from './cpp-options'


const cpp = {
    runFile: runCppFile,
    runSource: runCppSource
};

export { cpp, CPP_Options };
