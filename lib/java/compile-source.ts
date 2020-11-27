import { Result, ErrorType, Options } from "../types";
import path from 'path';
import { writeSource } from '../source-writer/read-write-util';
import { setupJavaDir } from "./setup";
import { compileJava } from "./compile";
/**
 * Compiles a java source string
 * @param source Java source to be compiled
 * @param options 
 */
export async function compileJavaSource(source: string, options?: Options): Promise<string> {
    //get target dir
    let dirPath = setupJavaDir();
    let publicClass;
    try {
        publicClass = getPublicClassName(source);
    }
    catch (err) { //no public class error
        throw err;
    }
    let fileName = `${publicClass}.java`;
    let filePath = path.join(dirPath, fileName);
    await writeSource(filePath, source);
    //compile
    return compileJava(filePath, options);
}

/**
 * Get the public class's name
 * @param source 
 */
function getPublicClassName(source: string): string {

    let javakeywords = [
    "abstract",     "assert",        "boolean",      "break",           "byte",
    "case",         "catch",         "char",         "class",           "const",
    "continue",     "default",       "do",           "double",          "else",
    "enum",         "extends",       "false",        "final",           "finally",
    "float",        "for",           "goto",         "if",              "implements",
    "import",       "instanceof",    "int",          "interface",       "long",
    "native",       "new",           "null",         "package",         "private",
    "protected",    "public",        "return",       "short",           "static",
    "strictfp",     "super",         "switch",       "synchronized",    "this",
    "throw",        "throws",        "transient",    "true",            "try",
    "void",         "volatile",      "while"
    ]
    

    const re = /public\s.*class\s+([A-Za-z_$]+[a-zA-Z0-9_$]*).*{/gm;
    
    let res = re.exec(source);

    if (res) {
        for (let keyword of javakeywords){
            if(res[1] === keyword){
                let errorRes:Result;
                errorRes ={
                    files: [],
                    memoryUsage: 0,
                    cpuUsage:0,
                    stdout: '',
                    stderr: `Class name can't be ${res[1]}`,
                    signal: '',
                    exitCode: 3,
                    errorType: ErrorType.COMPILE_TIME
                }
                throw errorRes;
            }
        }
        return res[1];
    }
    else {
        let errorRes:Result;
        errorRes ={
            files: [],
            memoryUsage: 0,
            cpuUsage:0,
            stdout: '',
            stderr: 'No public class found',
            signal: '',
            exitCode: 3,
            errorType: ErrorType.COMPILE_TIME
        }
        throw errorRes;
    }
}
