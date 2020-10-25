export interface Options {
    
    timeout?: number;
    stdin?: string;

    /**
     * Limit the ammount of characters of program's stderr, default is 1000
     */
    stderrLimit?: number;
    /**
     * Limit the ammount of characters of program's stdout, default is 1000
     */
    stdoutLimit?: number;

     /**
     * Vector containing needed environment variables that the code needs. Format should be {VARIABLE:VALUE, VARIABLE2:VALUE, ... }
     * 
     * can be a path like string to the compiler or custom command name whose path is already set
    */
   executionEnvArgs?: any;
    
}