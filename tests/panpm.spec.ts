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

test(pm.name, async ({ assert }) => {
  const cwd = fixtureDir(pm.name);
  process.chdir(cwd);

  const version = await pm.version();
  assert.isString(version);

  const install = await pm.install({ cwd });
  const result = await install.result;

  assert.isTrue(result.status);
}).disableTimeout();
