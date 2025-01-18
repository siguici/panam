import which from 'which';
import {
  $,
  exec as $exec,
  type ProcessOptions,
  defaultOptions
} from './process';

export type Version = `${number}.${number}.${number}`;

export function bind(instance: any, prototype: any) {
  for (const key of Object.getOwnPropertyNames(prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);

    if (descriptor && typeof descriptor.value === 'function') {
      const value = instance[key];
      if (typeof value === 'function') {
        instance[key] = value.bind(instance);
      }
    }
  }
}

export class Runner {
  constructor(readonly name: string) {
    bind(this, Runner.prototype);
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

  async version(): Promise<Version> {
    return (await $exec(`${this.realname} --version`)) as Version;
  }

  async help(): Promise<string> {
    return await $exec(`${this.realname} --help`);
  }

  async $(args: string | string[], options: ProcessOptions = defaultOptions) {
    args = this.parseArgs(args);

    return $(this.realname, args, options).result;
  }

  parseArgs(args: string | string[]): string[] {
    return Array.isArray(args) ? args : args.split(/\s+/);
  }
}
