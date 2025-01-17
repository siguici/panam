import path from 'node:path';
import process from 'node:process';
import { test } from '@japa/runner';
import pm from 'panam';
import { detectPackageManager } from 'panam/utils';

const currentPm = detectPackageManager().name;

delete process.env.npm_config_user_agent;

const fixtureDir = (pmName: string) => path.join('tests/fixtures', pmName);

test(`pm should be ${currentPm}`, ({ assert }) => {
  assert.equal(pm.name, currentPm);
});

test('pm should be installed', async ({ assert }) => {
  const isInstalled = await pm.isInstalled();
  assert.isBoolean(isInstalled);
});

test(pm.name, async ({ assert }) => {
  const cwd = fixtureDir(pm.name);
  const result = await pm.install({ cwd });

  assert.isTrue(result.status);
}).disableTimeout();
