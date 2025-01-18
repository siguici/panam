import path from 'node:path';
import process from 'node:process';
import { test } from '@japa/runner';
import panam, { whichRuntime, whichPackageManager } from 'panam';

const currentPm = whichPackageManager().name;
const currentRuntime = whichRuntime().name;

delete process.env.npm_config_user_agent;

const fixtureDir = (pmName: string) => path.join('tests/fixtures', pmName);

test(`pm and runtime should be ${currentPm} and ${currentRuntime}`, ({
  assert
}) => {
  assert.equal(panam.name, currentRuntime);
  assert.equal(panam.pm.name, currentPm);
});

test('engines should be installed', async ({ assert }) => {
  const runtimeIsInstalled = await panam.isInstalled();
  assert.isBoolean(runtimeIsInstalled);

  const pmIsInstalled = await panam.pm.isInstalled();
  assert.isBoolean(pmIsInstalled);
});

test(panam.pm.name, async ({ assert }) => {
  const cwd = fixtureDir(panam.pm.name);
  const result = await panam.install({ cwd });

  assert.isTrue(result.status);
}).disableTimeout();
