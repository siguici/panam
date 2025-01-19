import { existsSync } from 'node:fs';
import { join } from 'node:path';
import git, { type Git } from './git';
import pm, {
  PackageManager,
  type PackageManagerInfo,
  type PackageManagerName
} from './pm';
import {
  type ProcessOptions,
  type ProcessResult,
  defaultOptions
} from './process';
import runtime, {
  Runtime,
  type RuntimeInfo,
  type RuntimeName
} from './runtime';
import { type Tool, bind } from './tool';

export {
  whichRuntime,
  preferredRuntime,
  detectedRuntime,
  Runtime
} from './runtime';
export {
  whichPackageManager,
  detectedPackageManager,
  preferredPackageManager,
  PackageManager
} from './pm';
export { pm, runtime, git };

type ToolConstructor<T extends Tool> = new (name: string) => T;
type UsedAs<K extends string, T extends Tool = Tool> = {
  as: <P extends Panam>(
    alias: K
  ) => P & { tools: P['tools'] & { [Key in K]: T } };
};

export class Panam extends Runtime {
  readonly pm: PackageManager;
  readonly git: Git = git;
  readonly tools: Record<string, Tool> = {};

  constructor(
    runtime: RuntimeName | RuntimeInfo | Runtime,
    packageManager: PackageManagerName | PackageManagerInfo | PackageManager
  ) {
    super(typeof runtime === 'object' ? runtime.name : runtime);

    if (packageManager instanceof PackageManager) {
      this.pm = packageManager;
    } else {
      this.pm = new PackageManager(
        typeof packageManager === 'object'
          ? packageManager.name
          : packageManager
      );
    }

    bind(this, Panam.prototype);
  }

  use<K extends string, T extends Tool>(tool: T): UsedAs<K, T>;
  use<K extends string, T extends Tool>(
    tool: ToolConstructor<T>,
    name: K
  ): UsedAs<K, T>;
  use(arg1: any, arg2?: any) {
    if (arg2 !== undefined) {
      if (typeof arg1 !== 'function') {
        throw new Error('Tool must be a function');
      }

      arg1 = new arg1(arg2);
    }

    const name = arg1.name;

    if (!name) {
      throw new Error('Tool must have a name');
    }

    this.tools[name] = arg1;

    return {
      as: (alias: string) => {
        if (this.tools[alias]) {
          throw new Error(`Tool alias "${alias}" already exists.`);
        }
        this.tools[alias] = arg1;

        return this;
      }
    };
  }

  async init(
    packageManager: PackageManagerName,
    options?: ProcessOptions
  ): Promise<ProcessResult>;
  async init(options?: ProcessOptions): Promise<ProcessResult>;
  async init(arg1: any, arg2?: any): Promise<ProcessResult> {
    if (arg2 !== undefined) {
      return this.pm.init(arg1, arg2);
    }

    return this.pm.init(arg1);
  }

  async install(options: ProcessOptions = defaultOptions) {
    return this.pm.install(options);
  }

  async create(cli: string, options: ProcessOptions = defaultOptions) {
    return this.pm.create(cli, options);
  }

  async add(
    packages: string | string[],
    options: ProcessOptions = defaultOptions
  ) {
    return this.pm.add(packages, options);
  }

  async remove(
    packages: string | string[],
    options: ProcessOptions = defaultOptions
  ) {
    return this.pm.remove(packages, options);
  }

  async uninstall(
    packages: string | string[],
    options: ProcessOptions = defaultOptions
  ) {
    return this.pm.uninstall(packages, options);
  }

  async run(script: string, options: ProcessOptions = defaultOptions) {
    const cwd = options?.cwd || process.cwd();
    const file = join(cwd, script);

    if (existsSync(file)) {
      return super.run(file, options);
    }

    return this.pm.run(script, options);
  }

  async task(script: string, options: ProcessOptions = defaultOptions) {
    return this.pm.task(script, options);
  }

  async exec(command: string, options: ProcessOptions = defaultOptions) {
    return this.pm.exec(command, options);
  }

  async dlx(binary: string, options: ProcessOptions = defaultOptions) {
    return this.pm.dlx(binary, options);
  }

  async x(executable: string, options: ProcessOptions = defaultOptions) {
    return this.pm.x(executable, options);
  }

  async jsrAdd(packages: string[], options: ProcessOptions = defaultOptions) {
    return this.pm.jsrAdd(packages, options);
  }

  async jsrRemove(
    packages: string[],
    options: ProcessOptions = defaultOptions
  ) {
    return this.pm.jsrRemove(packages, options);
  }

  async jsrRun(script: string, options: ProcessOptions = defaultOptions) {
    return this.pm.jsrRun(script, options);
  }

  async jsrExec(command: string, options: ProcessOptions = defaultOptions) {
    return this.pm.jsrExec(command, options);
  }

  async jsrDlx(binary: string, options: ProcessOptions = defaultOptions) {
    return this.pm.jsrDlx(binary, options);
  }

  async jsrX(executable: string, options: ProcessOptions = defaultOptions) {
    return this.pm.jsrX(executable, options);
  }

  status(options: ProcessOptions = defaultOptions) {
    return this.git.status(options);
  }

  async commit(message: string, options: ProcessOptions = defaultOptions) {
    return this.git.commit(message, options);
  }

  async push(
    remote = 'origin',
    branch = 'main',
    options: ProcessOptions = defaultOptions
  ) {
    return this.git.push(remote, branch, options);
  }

  async pull(
    remote = 'origin',
    branch = 'main',
    options: ProcessOptions = defaultOptions
  ) {
    return this.git.push(remote, branch, options);
  }

  branch(name?: string, options: ProcessOptions = defaultOptions) {
    return this.git.branch(name, options);
  }

  checkout(branch: string, options: ProcessOptions = defaultOptions) {
    return this.git.checkout(branch, options);
  }

  merge(branch: string, options: ProcessOptions = defaultOptions) {
    return this.git.merge(branch, options);
  }
}

export function panam(
  runtime: RuntimeName | RuntimeInfo | Runtime,
  pm: PackageManagerName | PackageManagerInfo | PackageManager
) {
  return new Panam(runtime, pm);
}

const _panam = panam(runtime, pm);

const [
  name,
  realname,
  init,
  install,
  create,
  add,
  remove,
  uninstall,
  run,
  task,
  exec,
  dlx,
  x,
  jsrAdd,
  jsrRemove,
  jsrRun,
  jsrExec,
  jsrDlx,
  jsrX,
  status,
  commit,
  push,
  pull,
  branch,
  checkout,
  merge
] = [
  _panam.name,
  _panam.realname,
  _panam.init,
  _panam.install,
  _panam.create,
  _panam.add,
  _panam.remove,
  _panam.uninstall,
  _panam.run,
  _panam.exec,
  _panam.dlx,
  _panam.x,
  _panam.task,
  _panam.jsrAdd,
  _panam.jsrRemove,
  _panam.jsrRun,
  _panam.jsrExec,
  _panam.jsrDlx,
  _panam.jsrX,
  _panam.status,
  _panam.commit,
  _panam.push,
  _panam.pull,
  _panam.branch,
  _panam.checkout,
  _panam.merge
];

export {
  name,
  realname,
  init,
  install,
  create,
  add,
  remove,
  uninstall,
  run,
  task,
  exec,
  dlx,
  x,
  jsrAdd,
  jsrRemove,
  jsrRun,
  jsrExec,
  jsrDlx,
  jsrX,
  status,
  commit,
  push,
  pull,
  branch,
  checkout,
  merge
};

export default _panam;
