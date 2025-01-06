import { type ChildProcess, exec as processExec } from 'node:child_process';
import process from 'node:process';
import { spawn } from 'cross-spawn';

export type ProcessOptions = {
  daemon: boolean;
  cwd: ReturnType<typeof process.cwd>;
  env: typeof process.env;
};

export const processOptions: ProcessOptions = {
  daemon: false,
  cwd: process.cwd(),
  env: process.env
};

export const exec = (command: string) => {
  return new Promise(
    (resolve: (out: string) => void, reject: (err: Error) => void) => {
      processExec(command, (error, stdout, stderr) => {
        const err = error || stderr;

        if (err) {
          reject(err instanceof Error ? err : new Error(err));
        } else {
          resolve(stdout);
        }
      });
    }
  );
};

export function $(command: string, args: string[], options = processOptions) {
  let child: ChildProcess;

  const process = new Promise<boolean>((resolve, reject) => {
    try {
      child = spawn(command, args, {
        cwd: options.cwd,
        env: options.env,
        stdio: options.daemon ? 'ignore' : 'inherit',
        detached: options.daemon
      });

      child.on('error', (e) => {
        if (e) {
          reject(e);
          return;
        }
        resolve(false);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Command ${command} ${args.join(' ')} failed`));
          return;
        }
        resolve(code === 0);
      });
    } catch (e) {
      resolve(false);
    }
  });

  const abort = async () => {
    if (child) {
      child.kill('SIGINT');
    }
  };

  return { abort, process };
}
