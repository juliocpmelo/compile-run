import { runJavaSource } from './run-source';
import { runJavaFile } from './run-file';

import { Java_Options } from './java-options'

const java = {
    runSource: runJavaSource,
    runFile: runJavaFile
};

export { java, Java_Options };