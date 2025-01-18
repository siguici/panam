import { existsSync } from 'node:fs';
import { join } from 'node:path';
import pm, {
  PackageManager,
  type PackageManagerInfo,
  type PackageManagerName
} from './pm';
import { type ProcessOptions, defaultOptions } from './process';
import runtime, {
  Runtime,
  type RuntimeInfo,
  type RuntimeName
} from './runtime';

export { currentRuntime, detectRuntime, Runtime } from './runtime';
export {
  currentPackageManager,
  detectPackageManager,
  PackageManager
} from './pm';
export { pm, runtime };

export class Panam extends Runtime {
  readonly pm: PackageManager;

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
  }

  async install(options: ProcessOptions = defaultOptions) {
    return this.pm.install(options);
  }

  async create(app: string, options: ProcessOptions = defaultOptions) {
    return this.pm.create(app, options);
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
  jsrX
] = [
  _panam.name,
  _panam.realname,
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
  _panam.jsrX
];

export {
  name,
  realname,
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
  jsrX
};

export default _panam;
