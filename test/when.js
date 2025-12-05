import test from 'node:test';

test('npm validation logic (inquirer `when` function)', async t => {
  let askName2;
  let npmNameError;
  let conf;
  const inquirer = {
    prompt() {}
  };

  t.before(async t => {
    t.mock.module('npm-name', {
      defaultExport: name =>
        npmNameError instanceof Error ? Promise.reject(npmNameError) : Promise.resolve(name === 'yo')
    });
    askName2 = (await import('../lib/index.js')).default;
  });

  t.beforeEach(() => {
    npmNameError = undefined;
    conf = {
      name: 'name',
      message: 'Module name'
    };
  });

  await t.test('ask question if npm name is taken', async t => {
    t.mock.method(inquirer, 'prompt', () => Promise.resolve({ name: 'yo' }));
    conf.name = 'yo';

    await askName2(conf, inquirer);
    const { when } = inquirer.prompt.mock.calls[0].arguments[0][1];
    const shouldAsk = await when({ name: 'yo' });
    t.assert.ok(shouldAsk);
  });

  await t.test('does not ask question if npm name is free', async t => {
    t.mock.method(inquirer, 'prompt', () => Promise.resolve({ name: 'foo' }));

    await askName2(conf, inquirer);
    const { when } = inquirer.prompt.mock.calls[0].arguments[0][1];
    const shouldAsk = await when({ name: 'foo' });
    t.assert.ok(shouldAsk);
  });

  await t.test('does not ask if npm-name fails', async t => {
    t.mock.method(inquirer, 'prompt', () => Promise.resolve({ name: 'foo' }));

    npmNameError = new Error('Network Error');
    await askName2(conf, inquirer);
    const { when } = inquirer.prompt.mock.calls[0].arguments[0][1];

    await t.assert.rejects(when({ name: 'foo' }), 'Network error');
  });
});
