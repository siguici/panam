import which from 'which';
import whichPm from 'which-pm-runs';
import { $, exec as $exec, processOptions } from './process';

export class PackageManager {
  constructor(readonly name: string) {}

  get realname(): string {
    return which.sync(this.name);
  }

  runCommand(): string {
    const name = this.name;

    if (this.in(['npm', 'cnpm', 'bun', 'deno'])) {
      return `${name} run${this.isDeno() ? ' -A' : ''}`;
    }

    return name;
  }

  in(names: string[]): boolean {
    return names.includes(this.name);
  }

  is(name: string): boolean {
    return this.name === name;
  }

  isNpm(): boolean {
    return this.is('npm');
  }

  isCnpm(): boolean {
    return this.is('cnpm');
  }

  isYarn(): boolean {
    return this.is('yarn');
  }

  isPnpm(): boolean {
    return this.is('pnpm');
  }

  isBun(): boolean {
    return this.is('bun');
  }

  isDeno(): boolean {
    return this.is('deno');
  }

  async isInstalled(): Promise<boolean> {
    try {
      await this.version();
      return true;
    } catch (_) {
      return false;
    }
  }

  async version(): Promise<string> {
    return await $exec(`${this.realname} --version`);
  }

  async help(): Promise<string> {
    return await $exec(`${this.realname} --help`);
  }

  async $(args: string | string[], opts = processOptions) {
    args = Array.isArray(args) ? args : [args];

    return $(this.realname, args, opts);
  }

  async jsr(command: string, args: string[], options = processOptions) {
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

  async install(options = processOptions) {
    return this.$('install', options);
  }

  async i(options = processOptions) {
    return this.install(options);
  }

  async create(app: string, options = processOptions) {
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

  async add(packages: string | string[], options = processOptions) {
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

  async remove(packages: string | string[], options = processOptions) {
    packages = Array.isArray(packages) ? packages : packages.split(/\s+/);

    if (this.isJsr(packages[0])) {
      return this.jsrRemove(packages, options);
    }

    return this.$(
      [this.isNpm() ? 'uninstall' : 'remove', ...packages],
      options
    );
  }

  async rm(packages: string | string[], options = processOptions) {
    return this.remove(packages, options);
  }

  async uninstall(packages: string | string[], options = processOptions) {
    return this.remove(packages, options);
  }

  async run(script: string, options = processOptions) {
    if (this.isJsr(script)) {
      return this.jsrRun(script, options);
    }

    const args = script.split(/\s+/);

    return this.in(['pnpm', 'yarn'])
      ? this.$(args, options)
      : this.$([this.isDeno() ? 'task' : 'run', ...args], options);
  }

  async task(script: string, options = processOptions) {
    return this.run(script, options);
  }

  async exec(command: string, options = processOptions) {
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

  async dlx(binary: string, options = processOptions) {
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

  async x(executable: string, options = processOptions) {
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

  async jsrAdd(packages: string[], options = processOptions) {
    return this.jsr('add', packages, options);
  }

  async jsrRemove(packages: string[], options = processOptions) {
    return this.jsr('remove', packages, options);
  }

  async jsrRun(script: string, options = processOptions) {
    const args = script.split(/\s+/);

    return this.jsr('run', args, options);
  }

  async jsrExec(command: string, options = processOptions) {
    const args = command.split(/\s+/);

    return this.jsr('exec', args, options);
  }

  async jsrDlx(binary: string, options = processOptions) {
    const args = binary.split(/\s+/);

    return this.jsr('dlx', args, options);
  }

  async jsrX(executable: string, options = processOptions) {
    const args = executable.split(/\s+/);

    return this.jsr('x', args, options);
  }
}

export function pm(name: string): PackageManager {
  return new PackageManager(name);
}

const _pm: PackageManager = pm(whichPm()?.name || 'npm');

const [
  name,
  realname,
  install,
  i,
  create,
  add,
  remove,
  rm,
  uninstall,
  run,
  exec,
  dlx,
  x
] = [
  _pm.name,
  _pm.realname,
  _pm.install,
  _pm.i,
  _pm.create,
  _pm.add,
  _pm.remove,
  _pm.rm,
  _pm.uninstall,
  _pm.run,
  _pm.exec,
  _pm.dlx,
  _pm.x
];

export {
  name,
  realname,
  install,
  i,
  create,
  add,
  remove,
  rm,
  uninstall,
  run,
  exec,
  dlx,
  x
};

export default _pm;
