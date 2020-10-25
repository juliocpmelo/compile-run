import { runJavaSource } from './run-source';
import { runJavaFile } from './run-file';

import { Java_Options } from './java-options'

export { Java_Options }

export const java = {
    runSource: runJavaSource,
    runFile: runJavaFile
};

export default java;