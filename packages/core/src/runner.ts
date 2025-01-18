import which from 'which';
import {
  $,
  exec as $exec,
  type ProcessOptions,
  defaultOptions
} from './process';

export class Runner {
  constructor(readonly name: string) {
    for (const key of Object.getOwnPropertyNames(
      Runner.prototype
    ) as (keyof Runner)[]) {
      const descriptor = Object.getOwnPropertyDescriptor(Runner.prototype, key);

      if (descriptor && typeof descriptor.value === 'function') {
        const value = this[key];
        if (typeof value === 'function') {
          // @ts-ignore
          this[key] = value.bind(this);
        }
      }
    }
  }

  get realname(): string {
    return which.sync(this.name);
  }

  in(names: string[]): boolean {
    return names.includes(this.name);
  }

  is(name: string): boolean {
    return this.name === name;
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

  async $(args: string | string[], options: ProcessOptions = defaultOptions) {
    args = Array.isArray(args) ? args : [args];

    return $(this.realname, args, options).result;
  }
}
