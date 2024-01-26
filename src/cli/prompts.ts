import inquirer from "inquirer";

export const promptProjectName = async () => {
  const { name } = await inquirer.prompt<{ name: string }>([
    {
      name: "name",
      message: "What is the name of the project?",
      type: "input",
      transformer: (input: string) => {
        return input.toLowerCase().replace(/\s+/g, "-");
      },
    },
  ]);

  return name.toLowerCase().replace(/\s+/g, "-");
};

export const promptWithLint = async () => {
  const { withLint } = await inquirer.prompt<{ withLint: boolean }>([
    {
      name: "withLint",
      message: "Do you wish to include linting?",
      type: "confirm",
      default: true,
    },
  ]);

  return withLint;
};

export const promptPackageManager = async () => {
  const { packageManager } = await inquirer.prompt<{
    packageManager: "pnpm" | "yarn" | "npm";
  }>([
    {
      name: "packageManager",
      message: "Which package manager do you want to use?",
      type: "list",
      choices: ["pnpm", "yarn", "npm"],
      default: "pnpm",
    },
  ]);

  return packageManager;
};
