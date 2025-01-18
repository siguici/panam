import { type ProcessOptions, defaultOptions } from './process';
import { Runner } from './runner';
import { getRuntimeInfo, isRuntime } from './utils';

export class Runtime extends Runner {
  constructor(name: string) {
    if (!isRuntime(name)) {
      name = 'node';
    }

    super(name);
  }

  async run(file: string, options: ProcessOptions = defaultOptions) {
    if (this.is('deno')) {
      return this.$(['run', file], options);
    }

    return this.$(file, options);
  }
}

export function runtime(name: string): Runtime {
  return new Runtime(name);
}

const _runtime = runtime(getRuntimeInfo().name);

const [run] = [_runtime.run];

export { run };

export default _runtime;
