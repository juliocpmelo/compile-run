import { Result } from '../types';

/*sandbox message passing interfaces*/

export interface SandboxMessage {
    cmd: string;
    timeout: number;
    stdin: string;
    stderrLimit: number;
    stdoutLimit: number;
    arguments?: string[];
    envVariables?: any;
};

export interface ResponseMessage {
    status: 'success' | 'error';
    executionResult?: Result;
    error?: any;
}