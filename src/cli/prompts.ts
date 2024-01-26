import * as inquirer from "@inquirer/prompts";

export const promptProjectName = async () => {
  const name = await inquirer.input({
    message: "What is the name of the project?",
    transformer: (input: string) => {
      return input.toLowerCase().replace(/\s+/g, "-");
    },
  });

  return name.toLowerCase().replace(/\s+/g, "-");
};

export const promptWithLint = async () => {
  const withLint = await inquirer.confirm({
    message: "Do you wish to include linting?",
    default: true,
  });

  return withLint;
};

export const promptPackageManager = async () => {
  const packageManager = await inquirer.select({
    message: "Which package manager do you want to use?",
    default: "pnpm",
    choices: [
      {
        name: "pnpm",
        value: "pnpm",
      },
      {
        name: "yarn",
        value: "yarn",
      },
      {
        name: "npm",
        value: "npm",
      },
    ],
  });

  return packageManager;
};
