import path from 'node:path';
import process from 'node:process';
import { test } from '@japa/runner';
import pm from 'panam';
import whichPm from 'which-pm-runs';

const currentPm = whichPm()?.name ?? 'npm';

delete process.env.npm_config_user_agent;

const fixturesDir = path.join(import.meta.dirname, 'fixtures');
const fixtureDir = (pmName: string) => path.join(fixturesDir, pmName);

test(`pm should be ${currentPm}`, ({ assert }) => {
  assert.equal(pm.name, currentPm);
});

test('pm should be installed', async ({ assert }) => {
  const isInstalled = await pm.isInstalled();
  assert.isBoolean(isInstalled);
});

test(pm.name, async ({ assert }) => {
  const cwd = fixtureDir(pm.name);
  const install = await pm.install({ cwd });
  const result = await install.result;

  assert.isTrue(result.status);
}).disableTimeout();
