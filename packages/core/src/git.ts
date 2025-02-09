import { type ProcessOptions, defaultOptions } from './executor';
import { Tool, bind } from './tool';

export class Git extends Tool {
  constructor() {
    super('git');

    bind(this, Git.prototype);
  }

  init(options: ProcessOptions = defaultOptions) {
    return this.$('init', options);
  }

  status(options: ProcessOptions = defaultOptions) {
    return this.$('status', options);
  }

  add(
    files: string | string[] = '.',
    { force = false, patch = false }: { force?: boolean; patch?: boolean } = {},
    options: ProcessOptions = defaultOptions
  ) {
    const args = this.parseArgs(files);

    if (force) {
      args.push('--force');
    }

    if (patch) {
      args.push('--patch');
    }

    return this.$(['add', ...args], options);
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

  branch(name?: string, options: ProcessOptions = defaultOptions) {
    return name ? this.$(`branch ${name}`, options) : this.$('branch', options);
  }

  checkout(branch: string, options: ProcessOptions = defaultOptions) {
    return this.$(`checkout ${branch}`, options);
  }

  merge(branch: string, options: ProcessOptions = defaultOptions) {
    return this.$(`merge ${branch}`, options);
  }
}

export function git(): Git {
  return new Git();
}

const _git: Git = git();

const [init, status, add, commit, push, pull, branch, checkout, merge] = [
  _git.init,
  _git.status,
  _git.add,
  _git.commit,
  _git.push,
  _git.pull,
  _git.branch,
  _git.checkout,
  _git.merge
];

export { init, status, add, commit, push, pull, branch, checkout, merge };

export default _git;
