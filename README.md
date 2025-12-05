[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# inquirer-npm-name

Helper function using [inquirer](https://github.com/SBoudrias/Inquirer.js) to
validate a value provided in a prompt does not exist as a npm package.

The supplied value must be a valid package name (as per
[validate-npm-package-name]); otherwise, the user will again be prompted to
enter a name.

If the value is already used as a npm package, then the users will be prompted
and asked if they want to choose another one. If so, we'll recurse through the
same validation process until we have a name that is unused on the npm registry.
This is a helper to catch naming issue in advance, it is not a validation rule
as the user can always decide to continue with the same name.

## Install

```sh
$ npm install --save inquirer-npm-name
```

## Usage

```js
var inquirer = require('inquirer');
var askName = require('inquirer-npm-name');

askName(
  {
    name: 'name',
    message: 'Some Module Name' // Default: 'Module Name'
  },
  inquirer
).then(function(answer) {
  console.log(answer.name);
});

// Equivalent to {name: 'name'}
askName('name', inquirer).then(function(answer) {
  console.log(answer.name);
});
```

Inside a **Yeoman Generator** you'd call it this way:

```js
var generators = require('yeoman-generator');
var inquirer = require('inquirer');
var askName = require('inquirer-npm-name');

module.exports = generators.Base.extend({
  prompting: function() {
    return askName(
      {
        name: 'name',
        message: 'Module Name'
      },
      this
    ).then(function(name) {
      console.log(name);
    });
  }
});
```

`askName` takes 2 parameters:

1. `prompt` an [Inquirer prompt configuration](https://github.com/SBoudrias/Inquirer.js#question)
   or just a string to serve as name.
2. `inquirer` or any object with a `obj.prompt()` method.

**Returns:** A `Promise` resolved with the answer object.

## License

MIT © [Simon Boudrias](http://twitter.com/vaxilart)

[validate-npm-package-name]: https://npmjs.org/package/validate-npm-package-name

[npm-image]: https://img.shields.io/npm/v/inquirer-npm-name
[npm-url]: https://npmjs.org/package/inquirer-npm-name

[build-url]: https://github.com/pirxpilot/inquirer-npm-name/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/inquirer-npm-name/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/inquirer-npm-name
[deps-url]: https://libraries.io/npm/inquirer-npm-name
