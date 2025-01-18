import path from 'node:path';
import process from 'node:process';
import { test } from '@japa/runner';
import panam, {
  currentRuntime as getRuntimeInfo,
  currentPackageManager as getPackageManagerInfo
} from 'panam';

const currentPm = getPackageManagerInfo().name;
const currentRuntime = getRuntimeInfo().name;

delete process.env.npm_config_user_agent;

const fixtureDir = (pmName: string) => path.join('tests/fixtures', pmName);

test(`pm and runtime should be ${currentPm} and ${currentRuntime}`, ({
  assert
}) => {
  assert.equal(panam.pm.name, currentPm);
  assert.equal(panam.runtime.name, currentRuntime);
});

test('engines should be installed', async ({ assert }) => {
  const pmIsInstalled = await panam.pm.isInstalled();
  assert.isBoolean(pmIsInstalled);

  const runtimeIsInstalled = await panam.runtime.isInstalled();
  assert.isBoolean(runtimeIsInstalled);
});

test(panam.pm.name, async ({ assert }) => {
  const cwd = fixtureDir(panam.pm.name);
  const result = await panam.install({ cwd });

  assert.isTrue(result.status);
}).disableTimeout();
