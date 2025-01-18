import path from 'node:path';
import process from 'node:process';
import { test } from '@japa/runner';
import panam from 'panam';
import { getPackageManagerInfo, getRuntimeInfo } from 'panam/utils';

const currentPm = getPackageManagerInfo().name;
const currentRuntime = getRuntimeInfo().name;

delete process.env.npm_config_user_agent;

const fixtureDir = (pmName: string) => path.join('tests/fixtures', pmName);

test(`pm should be ${currentPm}`, ({ assert }) => {
  assert.equal(panam.pm.name, currentPm);
  assert.equal(panam.runtime.name, currentRuntime);
});

test('pm should be installed', async ({ assert }) => {
  const isInstalled = await panam.pm.isInstalled();
  assert.isBoolean(isInstalled);
});

test(panam.pm.name, async ({ assert }) => {
  const cwd = fixtureDir(panam.pm.name);
  const result = await panam.install({ cwd });

  assert.isTrue(result.status);
}).disableTimeout();
