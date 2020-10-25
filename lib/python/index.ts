import { Python_Options } from './python-options';
import { runPythonFile } from './run-file';
import { runPythonSourceCode } from './run-source';

export { Python_Options };

const python = {
    runFile: runPythonFile,
    runSource: runPythonSourceCode
};

export default python;
