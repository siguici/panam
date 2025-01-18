import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { type ProcessOptions, defaultOptions } from './process';
import { Runner, type Version, bind } from './runner';

export type RuntimeName = 'node' | 'bun' | 'deno';

export interface RuntimeInfo {
  name: RuntimeName;
  version?: Version;
}

export const defaultRuntimeInfo: RuntimeInfo = {
  name: 'node',
  version: undefined
};

export function currentRuntime(cwd = process.cwd()): RuntimeInfo {
  let name: RuntimeName;
  //@ts-ignore
  if (typeof Bun !== 'undefined') {
    name = 'bun';
    //@ts-ignore
  } else if (typeof Deno !== 'undefined') {
    name = 'deno';
  } else {
    name = 'node';
  }

  const version = getRuntimeVersion(name);

  if (version) {
    return {
      name,
      version
    };
  }

  return detectRuntime(cwd);
}

export function isRuntime(name: string): name is RuntimeName {
  return ['node', 'bun', 'deno'].includes(name);
}

export function getRuntimeVersion(runtime: string): Version | undefined {
  switch (runtime) {
    case 'node':
      // @ts-ignore
      return process.versions.node;
    case 'deno':
      // @ts-ignore
      return Deno.version.deno;
    case 'bun':
      // @ts-ignore
      return Bun.version;
    default:
      return undefined;
  }
}

export function detectRuntime(cwd = process.cwd()): RuntimeInfo {
  let engines: Record<string, string> = {};
  const packageJson = join(cwd, 'package.json');

  if (existsSync(packageJson)) {
    try {
      engines = JSON.parse(readFileSync(packageJson, 'utf-8')).engines;
    } catch {}
  }

  for (let name of Object.keys(engines)) {
    name = name.toLowerCase();
    if (isRuntime(name)) {
      return {
        name,
        version: getRuntimeVersion(name)
      };
    }
  }

  return {
    name: 'node',
    version: getRuntimeVersion('node')
  };
}

export class Runtime extends Runner {
  constructor(name: string) {
    if (!isRuntime(name)) {
      name = 'node';
    }

    super(name);
    bind(this, Runtime.prototype);
  }

  async run(file: string, options: ProcessOptions = defaultOptions) {
    if (this.is('deno')) {
      return this.$(['run', '-A', file], options);
    }

    return this.$(file, options);
  }
}

export function runtime(name: string): Runtime {
  return new Runtime(name);
}

const _runtime = runtime(currentRuntime().name);

const [run] = [_runtime.run];

export { run };

export default _runtime;
