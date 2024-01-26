import confirm from "@inquirer/confirm";
import input from "@inquirer/input";
import select from "@inquirer/select";

export const promptProjectName = async () => {
  const name = await input({
    message: "What is the name of the project?",
    transformer: (input: string) => {
      return input.toLowerCase().replace(/\s+/g, "-");
    },
  });

  return name.toLowerCase().replace(/\s+/g, "-");
};

export const promptWithLint = async () => {
  const withLint = await confirm({
    message: "Do you wish to include linting?",
    default: true,
  });

  return withLint;
};

export const promptPackageManager = async () => {
  const packageManager = await select({
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
