import { test } from '@japa/runner';
import { runtime } from 'panam';

test(runtime.name, async ({ assert }) => {
  const result = await runtime.run('dist/cli.js exec tsx tests/hello.ts');
  assert.isTrue(result.status);
}).disableTimeout();
