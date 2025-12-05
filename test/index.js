import test from 'node:test';
import askName from '../lib/index.js';

test('inquirer-npm-name', async t => {
  let conf;
  const inquirer = {
    prompt() {}
  };

  t.beforeEach(() => {
    conf = {
      name: 'name',
      message: 'Module name'
    };
  });

  await t.test('only ask name if name is free', async t => {
    t.mock.method(inquirer, 'prompt', () => Promise.resolve({ name: 'foo' }));

    const props = await askName(conf, inquirer);
    t.assert.equal(props.name, 'foo');
  });

  await t.test('recurse if name is taken', async t => {
    t.mock.method(inquirer, 'prompt', () => Promise.resolve({ name: 'bar' }));
    inquirer.prompt.mock.mockImplementationOnce(() => Promise.resolve({ name: 'foo', askAgain: true }));

    const props = await askName(conf, inquirer);
    t.assert.equal(props.name, 'bar');
    t.assert.equal(inquirer.prompt.mock.callCount(), 2);
  });
});
