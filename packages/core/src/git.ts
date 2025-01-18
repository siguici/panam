import { type ProcessOptions, defaultOptions } from './process';
import { Runner, bind } from './runner';

export class Git extends Runner {
  constructor() {
    super('git');

    bind(this, Git.prototype);
  }

  init(options: ProcessOptions = defaultOptions) {
    return this.$('init', options);
  }

  add(
    files: string | string[] = '.',
    options: ProcessOptions = defaultOptions
  ) {
    files = this.parseArgs(files);

    return this.$(['add', ...files], options);
  }

  commit(message: string, options: ProcessOptions = defaultOptions) {
    return this.$(`commit -m "${message}"`, options);
  }

  push(
    remote = 'origin',
    branch = 'main',
    options: ProcessOptions = defaultOptions
  ) {
    return this.$(`push ${remote} ${branch}`, options);
  }

  pull(
    remote = 'origin',
    branch = 'main',
    options: ProcessOptions = defaultOptions
  ) {
    return this.$(`pull ${remote} ${branch}`, options);
  }
}

export function git(): Git {
  return new Git();
}

const _git = git();

const [init, add, commit, push, pull] = [
  _git.init,
  _git.add,
  _git.commit,
  _git.push,
  _git.pull
];

export { init, add, commit, push, pull };
