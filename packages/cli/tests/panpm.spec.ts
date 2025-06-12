import { test } from '@japa/runner';
import { runtime } from 'panam';

test(runtime.name, async ({ assert }) => {
  console.log('[DEBUG] Runtime:', runtime.realname);
  const result = await runtime.run('dist/cli.js tsx tests/hello.ts');
  assert.isTrue(result.status);
}).disableTimeout();
