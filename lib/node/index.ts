import { Node_Options } from './node-options';
import { runNodeFile } from './run-file';
import { runNodeSourceCode } from './run-source';

export { Node_Options };

const node = {
    runFile: runNodeFile,
    runSource: runNodeSourceCode
};

export default node;
