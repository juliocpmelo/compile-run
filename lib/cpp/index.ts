import { runCppFile } from './run-file';
import { runCppSource } from './run-source';

import { CPP_Options } from './cpp-options'

export { CPP_Options };

const cpp = {
    runFile: runCppFile,
    runSource: runCppSource
};

export default cpp;
