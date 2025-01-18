import { type ProcessOptions, defaultOptions } from './process';
import { Runner } from './runner';
import { getPackageManagerInfo, isPackageManager } from './utils';

export class PackageManager extends Runner {
  constructor(name: string) {
    if (!isPackageManager(name)) {
      name = 'npm';
    }

    super(name);
  }

  runCommand(): string {
    const name = this.name;

    if (this.in(['npm', 'cnpm', 'bun', 'deno'])) {
      return `${name} run${this.isDeno() ? ' -A' : ''}`;
    }

    return name;
  }

  isNpm(): this is PackageManager & { name: 'npm' } {
    return this.is('npm');
  }

  isCnpm(): this is PackageManager & { name: 'cnpm' } {
    return this.is('cnpm');
  }

  isYarn(): this is PackageManager & { name: 'yarn' } {
    return this.is('yarn');
  }

  isPnpm(): this is PackageManager & { name: 'pnpm' } {
    return this.is('pnpm');
  }

  isBun(): this is PackageManager & { name: 'bun' } {
    return this.is('bun');
  }

  isDeno(): this is PackageManager & { name: 'deno' } {
    return this.is('deno');
  }

  async jsr(
    command: string,
    args: string[],
    options: ProcessOptions = defaultOptions
  ) {
    if (this.isDeno()) {
      args = args.map((arg) => this.toJsr(arg));

      switch (command) {
        case 'add':
        case 'install':
        case 'i':
          return this.$(['add', ...args], options);

        case 'remove':
        case 'uninstall':
        case 'r':
          return this.$(['uninstall', ...args], options);

        case 'run':
        case 'exec':
          return this.$(['run', '-A', ...args], options);

        case 'dlx':
        case 'x':
          return this.$(['run', '-A', '-r', ...args], options);

        default:
          return this.$([command, ...args], options);
      }
    }

    args = args.map((arg) => this.unJsr(arg));

    return this.$(
      `${this.in(['pnpm', 'yarn']) ? 'dlx' : 'x'} jsr ${['run', 'exec', 'dlx', 'x'].includes(command) ? 'run' : command} ${args.join(' ')}`,
      options
    );
  }

  isJsr(module: string): boolean {
    return module.startsWith('jsr:');
  }

  toJsr(module: string): string {
    return this.isJsr(module) ? module : `jsr:${module}`;
  }

  unJsr(module: string): string {
    return module.replace(/^jsr:/, '');
  }

  async install(options: ProcessOptions = defaultOptions) {
    return this.$('install', options);
  }

  async create(app: string, options: ProcessOptions = defaultOptions) {
    let args = app.split(/\s+/);

    if (this.isDeno()) {
      const packageName = args[1];
      const parts = packageName.split('/', 2);
      const createCommand = parts[1]
        ? `npm:${parts[0]}/create-${parts[1]}`
        : `npm:create-${parts[0]}`;

      args = ['run', '-A', createCommand, ...args.slice(2)];
    } else {
      args = ['create', ...args];
    }

    return this.$(args, options);
  }

  async add(
    packages: string | string[],
    options: ProcessOptions = defaultOptions
  ) {
    packages = Array.isArray(packages) ? packages : packages.split(/\s+/);

    if (this.isJsr(packages[0])) {
      return this.jsrAdd(packages, options);
    }

    return this.isDeno()
      ? this.$(
          [
            'add',
            ...packages.map((pkg) =>
              pkg.startsWith('npm:') ? pkg : `npm:${pkg}`
            )
          ],
          options
        )
      : this.$(
          [
            this.isNpm() ? 'install' : 'add',
            ...packages.map((pkg) => pkg.replace(/^npm:/, ''))
          ],
          options
        );
  }

  async remove(
    packages: string | string[],
    options: ProcessOptions = defaultOptions
  ) {
    packages = Array.isArray(packages) ? packages : packages.split(/\s+/);

    if (this.isJsr(packages[0])) {
      return this.jsrRemove(packages, options);
    }

    return this.$(
      [this.isNpm() ? 'uninstall' : 'remove', ...packages],
      options
    );
  }

  async uninstall(
    packages: string | string[],
    options: ProcessOptions = defaultOptions
  ) {
    return this.remove(packages, options);
  }

  async run(script: string, options: ProcessOptions = defaultOptions) {
    if (this.isJsr(script)) {
      return this.jsrRun(script, options);
    }

    const args = script.split(/\s+/);

    return this.in(['pnpm', 'yarn'])
      ? this.$(args, options)
      : this.$([this.isDeno() ? 'task' : 'run', ...args], options);
  }

  async task(script: string, options: ProcessOptions = defaultOptions) {
    return this.run(script, options);
  }

  async exec(command: string, options: ProcessOptions = defaultOptions) {
    if (this.isJsr(command)) {
      return this.jsrExec(command, options);
    }

    const args = command.split(/\s+/);

    return this.$(
      [
        ...(this.isDeno()
          ? ['run', '-A']
          : this.in(['pnpm', 'yarn'])
            ? ['exec']
            : ['x']),
        ...args
      ],
      options
    );
  }

  async dlx(binary: string, options: ProcessOptions = defaultOptions) {
    if (this.isJsr(binary)) {
      return this.jsrDlx(binary, options);
    }

    const args = binary.split(/\s+/);

    return this.$(
      [
        ...(this.isDeno()
          ? ['run', '-A', '-r']
          : this.in(['pnpm', 'yarn'])
            ? ['dlx']
            : ['x']),
        ...args
      ],
      options
    );
  }

  async x(executable: string, options: ProcessOptions = defaultOptions) {
    if (this.isJsr(executable)) {
      return this.jsrDlx(executable, options);
    }

    if (this.in(['deno', 'pnpm', 'yarn'])) {
      try {
        return this.exec(executable, options);
      } catch (e: any) {
        return this.dlx(executable, options);
      }
    }

    return this.$(['x', ...executable.split(/\s+/)], options);
  }

  async jsrAdd(packages: string[], options: ProcessOptions = defaultOptions) {
    return this.jsr('add', packages, options);
  }

  async jsrRemove(
    packages: string[],
    options: ProcessOptions = defaultOptions
  ) {
    return this.jsr('remove', packages, options);
  }

  async jsrRun(script: string, options: ProcessOptions = defaultOptions) {
    const args = script.split(/\s+/);

    return this.jsr('run', args, options);
  }

  async jsrExec(command: string, options: ProcessOptions = defaultOptions) {
    const args = command.split(/\s+/);

    return this.jsr('exec', args, options);
  }

  async jsrDlx(binary: string, options: ProcessOptions = defaultOptions) {
    const args = binary.split(/\s+/);

    return this.jsr('dlx', args, options);
  }

  async jsrX(executable: string, options: ProcessOptions = defaultOptions) {
    const args = executable.split(/\s+/);

    return this.jsr('x', args, options);
  }
}

export function pm(name: string): PackageManager {
  return new PackageManager(name);
}

const _pm: PackageManager = pm(getPackageManagerInfo().name);

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
  _pm.name,
  _pm.realname,
  _pm.install,
  _pm.create,
  _pm.add,
  _pm.remove,
  _pm.uninstall,
  _pm.run,
  _pm.exec,
  _pm.task,
  _pm.dlx,
  _pm.x,
  _pm.jsrAdd,
  _pm.jsrRemove,
  _pm.jsrRun,
  _pm.jsrExec,
  _pm.jsrDlx,
  _pm.jsrX
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

export default _pm;
