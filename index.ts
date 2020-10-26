import './lib/init';
import { c, C_Options } from './lib/c';
import { cpp, CPP_Options } from './lib/cpp';
import { python, Python_Options } from './lib/python';
import { node, Node_Options } from './lib/node';
import { java, Java_Options } from './lib/java';
import { errorResultCallback, LanguageExtMap, LanguageNames, Result } from './lib/types';


export { c, C_Options };
export { cpp, CPP_Options};
export { python, Python_Options};
export { node, Node_Options };
export { java, Java_Options };
export { errorResultCallback, LanguageExtMap, LanguageNames, Result };

const compileRun = { c, cpp, python, node, java };
export default compileRun;