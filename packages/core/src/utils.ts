import fs from 'node:fs';
import type {
  PackageJsonInfo,
  PackageManagerInfo,
  PackageManagerName,
  RuntimeInfo,
  RuntimeName,
  Version
} from './types';

export const defaultRuntimeInfo: RuntimeInfo = {
  name: 'node',
  version: 'latest'
};

export const defaultPackageManagerInfo: PackageManagerInfo = {
  name: 'npm',
  version: 'latest',
  lockfile: undefined
};

export const defaultWorkingDirectory = process.cwd();

export function getPackageManagerInfo(
  cwd = defaultWorkingDirectory
): PackageManagerInfo {
  const userAgent = process.env.npm_config_user_agent;

  if (!userAgent) {
    return detectPackageManager(cwd);
  }

  return parseUserAgent(userAgent);
}

export function parseUserAgent(userAgent: string): PackageManagerInfo {
  const pmSpec = userAgent.split(' ')[0];
  const separatorPos = pmSpec.lastIndexOf('/');
  const name = pmSpec.substring(0, separatorPos);
  const version = pmSpec.substring(separatorPos + 1) as Version;

  return {
    name: name === 'npminstall' ? 'cnpm' : (name as PackageManagerName),
    version
  };
}

export function getRuntimeInfo(cwd = defaultWorkingDirectory): RuntimeInfo {
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

export function isPackageManager(name: string): name is PackageManagerName {
  return ['npm', 'cnpm', 'yarn', 'pnpm', 'bun', 'deno'].includes(name);
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

export function detectRuntime(cwd = defaultWorkingDirectory): RuntimeInfo {
  const engines = parsePackageJson(cwd).engines;

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

export function parsePackageJson(
  cwd = defaultWorkingDirectory
): PackageJsonInfo {
  const pkg = JSON.parse(fs.readFileSync(`${cwd}/package.json`, 'utf-8'));
  return {
    name: pkg.name || '',
    version: pkg.version || '',
    engines: pkg.engines || {},
    packageManager: pkg.packageManager || ''
  };
}

export function detectPackageManager(
  cwd = defaultWorkingDirectory
): PackageManagerInfo {
  let name = '';
  let version: Version = 'latest';
  let lockfile: string | undefined = '';

  if (fs.existsSync(`${cwd}/package.json`)) {
    try {
      const pkgManager = parsePackageJson(cwd).packageManager;
      if (pkgManager) {
        [name, version] = parsePackageManager(pkgManager);
      }
    } catch {
      // Ignore JSON parsing errors
    }
  }

  const lockfileDetection = [
    { lockfile: 'pnpm-lock.yaml', name: 'pnpm' },
    { lockfile: 'yarn.lock', name: 'yarn' },
    { lockfile: 'package-lock.json', name: 'npm' },
    { lockfile: 'bun.lockb', name: 'bun' },
    { lockfile: 'deno.lock', name: 'deno' }
  ];

  if (!name) {
    for (const { lockfile: pmLockfile, name: pmName } of lockfileDetection) {
      if (fs.existsSync(`${cwd}/${pmLockfile}`)) {
        name = pmName;
        lockfile = pmLockfile;
        break;
      }
    }
  }

  name = name || getRuntimeInfo(cwd).name;
  name = name === 'node' ? 'npm' : name;
  lockfile = lockfile || undefined;

  if (isPackageManager(name)) {
    return { name, version, lockfile };
  }

  return { name: 'npm', version, lockfile: undefined };
}

export function parsePackageManager(
  input: string
): [PackageManagerName, Version] {
  const [name, version = 'latest'] = input.split('@', 2) as [
    PackageManagerName,
    Version
  ];

  return [name, version];
}
