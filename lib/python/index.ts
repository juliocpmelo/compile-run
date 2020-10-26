import { Python_Options } from './python-options';
import { runPythonFile } from './run-file';
import { runPythonSourceCode } from './run-source';


const python = {
    runFile: runPythonFile,
    runSource: runPythonSourceCode
};

export { python, Python_Options };
