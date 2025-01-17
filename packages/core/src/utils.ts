import { execSync } from 'node:child_process';
import * as fs from 'node:fs';

export interface RuntimeInfo {
  name: string;
  version?: string;
}

export interface PackageManagerInfo {
  name: string;
  version?: string;
  lockfile?: string;
}

export interface OperatingSystemInfo {
  platform: string;
  os?: string;
  arch: string;
  version?: string;
}

export interface EnvironmentInfo {
  runtime: RuntimeInfo;
  pm: PackageManagerInfo;
  os: OperatingSystemInfo;
}

export interface PackageJsonInfo {
  name: string;
  version: string;
  engines: Record<string, string>;
  packageManager: string;
}

export const defaultRuntimeInfo: RuntimeInfo = {
  name: 'node',
  version: 'latest'
};

export const defaultPackageManagerInfo: PackageManagerInfo = {
  name: 'npm',
  version: 'latest',
  lockfile: undefined
};

export const defaultOperatingSystemInfo: OperatingSystemInfo = {
  platform: process.platform,
  os: undefined,
  arch: process.arch,
  version: undefined
};

const defaultEnvironment: EnvironmentInfo = {
  runtime: defaultRuntimeInfo,
  pm: defaultPackageManagerInfo,
  os: defaultOperatingSystemInfo
};

const defaultWorkingDirectory = process.cwd();

function getPackageManagerInfo(
  cwd = defaultWorkingDirectory
): PackageManagerInfo {
  const userAgent = process.env.npm_config_user_agent;

  if (!userAgent) {
    return detectPackageManager(cwd);
  }

  return parseUserAgent(userAgent);
}

function parseUserAgent(userAgent: string): PackageManagerInfo {
  const pmSpec = userAgent.split(' ')[0];
  const separatorPos = pmSpec.lastIndexOf('/');
  const name = pmSpec.substring(0, separatorPos);
  const version = pmSpec.substring(separatorPos + 1);

  return {
    name: name === 'npminstall' ? 'cnpm' : name,
    version
  };
}

function getRuntimeInfo(cwd = defaultWorkingDirectory): RuntimeInfo {
  let name: string;
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

function getRuntimeVersion(runtime: string): string | undefined {
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

function detectRuntime(cwd = defaultWorkingDirectory): RuntimeInfo {
  const engines = parsePackageJson(cwd).engines;

  for (let name of Object.keys(engines)) {
    name = name.toLowerCase();
    if (['bun', 'deno', 'node'].includes(name)) {
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

function parsePackageJson(cwd = defaultWorkingDirectory): PackageJsonInfo {
  const pkg = JSON.parse(fs.readFileSync(`${cwd}/package.json`, 'utf-8'));
  return {
    name: pkg.name || '',
    version: pkg.version || '',
    engines: pkg.engines || {},
    packageManager: pkg.packageManager || ''
  };
}

function detectPackageManager(
  cwd = defaultWorkingDirectory
): PackageManagerInfo {
  let name = '';
  let version = '';
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

  return { name, version, lockfile };
}

function detectOS(): OperatingSystemInfo {
  const platform = process.platform;
  let os: string;
  let version: string | undefined;
  const arch = normalizeArch(process.arch);

  if (platform === 'darwin') {
    os = 'macOS';
    version = execSync('sw_vers -productVersion').toString().trim();
  } else if (platform === 'linux') {
    os = 'Linux';
    if (fs.existsSync('/etc/os-release')) {
      const osRelease = fs.readFileSync('/etc/os-release', 'utf-8');
      const name = getValueFromRelease(osRelease, 'NAME');
      const versionId = getValueFromRelease(osRelease, 'VERSION_ID');
      os = name || os;
      version = versionId || undefined;
    }
  } else if (platform === 'win32') {
    os = 'Windows';
    version = execSync(
      'powershell -Command "(Get-CimInstance -Class Win32_OperatingSystem).Version"'
    )
      .toString()
      .trim();
  } else {
    os = 'unknown';
    version = undefined;
  }

  return {
    platform,
    os,
    arch,
    version
  };
}

function parsePackageManager(input: string): [string, string] {
  const [name, version = 'latest'] = input.split('@', 2);

  return [name, version];
}

function normalizeArch(arch: string): string {
  switch (arch) {
    case 'x86_64':
    case 'amd64':
      return 'x64';
    case 'i386':
    case 'i686':
      return 'x86';
    case 'armv7l':
    case 'armhf':
      return 'arm';
    case 'aarch64':
    case 'arm64':
      return 'arm64';
    case 'riscv64':
      return 'riscv64';
    default:
      return 'unknown';
  }
}

function getValueFromRelease(release: string, key: string): string | null {
  const regex = new RegExp(`^${key}=(.*)$`, 'm');
  const match = regex.exec(release);
  return match ? match[1].replace(/"/g, '') : null;
}
