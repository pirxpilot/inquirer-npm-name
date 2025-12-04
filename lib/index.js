import npmName from 'npm-name';
import upperCaseFirst from 'upper-case-first';
import validatePackageName from 'validate-npm-package-name';

const defaults = {
  message: 'Module Name',
  validate() {
    return true;
  }
};

/**
 * This function will use the given prompt config and will then check if the value is
 * available as a name on npm. If the name is already picked, we'll ask the user to
 * confirm or pick another name.
 * @param  {(Object|String)} prompt   Inquirer prompt configuration or the name to be
 *                                    used in it.
 * @param  {inquirer}        inquirer Object with a `prompt` method. Usually `inquirer`
                                      or a yeoman-generator.
 */
export default function askName(prompt, inquirer) {
  if (typeof prompt === 'string') {
    prompt = {
      name: prompt
    };
  }

  const prompts = [
    Object.assign({}, defaults, prompt, {
      validate(val, ...args) {
        const packageNameValidity = validatePackageName(val);

        if (packageNameValidity.validForNewPackages) {
          const validate = prompt.validate || defaults.validate;

          return validate.call(this, val, ...args);
        }

        return upperCaseFirst(packageNameValidity.errors[0]) || 'The provided value is not a valid npm package name';
      }
    }),
    {
      type: 'confirm',
      name: 'askAgain',
      message: 'The name above already exists on npm, choose another?',
      default: true,
      async when(answers) {
        const available = await npmName(answers[prompt.name]);
        return !available;
      }
    }
  ];

  return inquirer.prompt(prompts).then(props => {
    if (props.askAgain) {
      return askName(prompt, inquirer);
    }

    return props;
  });
}
