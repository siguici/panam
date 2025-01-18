export type PackageManagerName =
  | 'npm'
  | 'cnpm'
  | 'yarn'
  | 'pnpm'
  | 'bun'
  | 'deno';
export type RuntimeName = 'node' | 'bun' | 'deno';
export type Version = `${number}.${number}.${number}` | 'latest';

export interface RuntimeInfo {
  name: RuntimeName;
  version?: Version;
}

export interface PackageManagerInfo {
  name: PackageManagerName;
  version?: Version;
  lockfile?: string;
}

export interface PackageJsonInfo {
  name: string;
  version: string;
  engines: Record<RuntimeName | PackageManagerName, string>;
  packageManager: `${PackageManagerName}@${Version}`;
}
