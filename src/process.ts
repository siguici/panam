import { type ChildProcess, exec as processExec } from 'node:child_process';
import process from 'node:process';
import { spawn } from 'cross-spawn';

export type ProcessConfig = {
  daemon: boolean;
  cwd: ReturnType<typeof process.cwd>;
  env: typeof process.env;
};

export type Process = {
  abort(): Promise<void>;
  result: Promise<ProcessResult>;
};
export type ProcessOptions = Partial<ProcessConfig> | undefined;
export type ProcessResult =
  | {
      status: true;
      code: 0;
    }
  | {
      status: false;
      error: unknown;
    };

export const defaultOptions: ProcessConfig = {
  daemon: false,
  cwd: process.cwd(),
  env: process.env
} as const;

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

export function $(
  command: string,
  args: string[],
  options: ProcessOptions = defaultOptions
): Process {
  let child: ChildProcess;

  const _options = options ?? defaultOptions;
  _options.env ??= defaultOptions.env;
  _options.cwd ??= defaultOptions.cwd;
  _options.daemon ??= defaultOptions.daemon;

  const result = new Promise<ProcessResult>((resolve) => {
    try {
      child = spawn(command, args, {
        cwd: _options.cwd,
        env: _options.env,
        stdio: _options.daemon ? 'ignore' : 'inherit',
        detached: _options.daemon
      });

      child.on('error', (e) => {
        return {
          status: false,
          error: e
        };
      });

      child.on('close', (code) => {
        if (code !== 0) {
          resolve({
            status: false,
            error: new Error(`Command ${command} ${args.join(' ')} failed`)
          });

          return;
        }

        resolve({
          status: true,
          code
        });
      });
    } catch (e) {
      return resolve({ status: false, error: e });
    }
  });

  const abort = async () => {
    if (child) {
      child.kill('SIGINT');
    }
  };

  return { abort, result };
}
