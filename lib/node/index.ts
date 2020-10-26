import { Node_Options } from './node-options';
import { runNodeFile } from './run-file';
import { runNodeSourceCode } from './run-source';

const node = {
    runFile: runNodeFile,
    runSource: runNodeSourceCode
};

export { node, Node_Options};
