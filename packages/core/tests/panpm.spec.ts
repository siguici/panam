import path from 'node:path';
import process from 'node:process';
import { test } from '@japa/runner';
import panam, { currentRuntime, currentPackageManager } from 'panam';

const currentPmName = currentPackageManager().name;
const currentRuntimeName = currentRuntime().name;

delete process.env.npm_config_user_agent;

const fixtureDir = (pmName: string) => path.join('tests/fixtures', pmName);

test(`pm and runtime should be ${currentPmName} and ${currentRuntime}`, ({
  assert
}) => {
  assert.equal(panam.name, currentRuntimeName);
  assert.equal(panam.pm.name, currentPmName);
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
