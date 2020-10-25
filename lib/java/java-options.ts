import {Options} from '../types/interfaces/options'

export interface Java_Options extends Options{

    compileTimeout?: number;

    /**
     * Set or compiler args if necessary for the specific language
     */
    compilerArgs?: string[];

    /**
     * Path to the compiler path like javac
     * 
     * can be a path like string to the compiler or custom command name whose path is already set
     */
    compilerPath?: string;

    /**
     * Path to the execution Command for java
     * 
     */
    executionPath?: string;
}