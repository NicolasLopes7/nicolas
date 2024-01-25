import inquirer from "inquirer";

export const promptProjectName = async () => {
  const { name } = await inquirer.prompt<{ name: string }>([
    {
      name: "name",
      message: "What is the name of the project?",
      type: "input",
    },
  ]);

  return name;
};
