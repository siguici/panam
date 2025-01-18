import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const toPath = (urlOrPath: string | URL): string =>
  urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

interface FindUpOptions {
  cwd?: string;
  type?: 'file' | 'directory';
  stopAt?: string;
}

export async function findUp(
  name: string,
  { cwd = process.cwd(), type = 'file', stopAt }: FindUpOptions = {}
): Promise<string | undefined> {
  let directory = path.resolve(toPath(cwd));
  const { root } = path.parse(directory);
  stopAt = path.resolve(directory, toPath(stopAt ?? root));

  while (directory && directory !== stopAt && directory !== root) {
    const filePath = path.isAbsolute(name) ? name : path.join(directory, name);

    try {
      const stats = await fsPromises.stat(filePath);
      if (
        (type === 'file' && stats.isFile()) ||
        (type === 'directory' && stats.isDirectory())
      ) {
        return filePath;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    directory = path.dirname(directory);
  }
  return undefined;
}

export function findUpSync(
  name: string,
  { cwd = process.cwd(), type = 'file', stopAt }: FindUpOptions = {}
): string | undefined {
  let directory = path.resolve(toPath(cwd));
  const { root } = path.parse(directory);
  stopAt = path.resolve(directory, toPath(stopAt ?? root));

  while (directory && directory !== stopAt && directory !== root) {
    const filePath = path.isAbsolute(name) ? name : path.join(directory, name);

    try {
      const stats = fs.statSync(filePath);
      if (
        (type === 'file' && stats.isFile()) ||
        (type === 'directory' && stats.isDirectory())
      ) {
        return filePath;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    directory = path.dirname(directory);
  }
  return undefined;
}
