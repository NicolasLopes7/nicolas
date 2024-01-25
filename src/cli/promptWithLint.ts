import inquirer from "inquirer";

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
