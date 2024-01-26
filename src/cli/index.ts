import chalk from "chalk";
import { Command } from "commander";

import {
  checkIfFolderIsEmpty,
  getFullPath,
  isProjectNameValid,
} from "~/helpers";
import {
  promptProjectName,
  promptRemoveFolderAfterFinish,
  promptWithLint,
} from "./prompts";

interface CliOutput {
  name: string;
  withLint: boolean;
  removeFolderAfterFinish: boolean;
}

const defaultOptions: CliOutput = {
  name: "nicolas",
  withLint: false,
  removeFolderAfterFinish: false,
};

export const runCli = async (): Promise<CliOutput> => {
  const isRunningDevScript = process.env.npm_lifecycle_event === "dev";

  const program = new Command()
    .name("nicolas")
    .argument("[name]", "name of the project")
    .option("--with-lint", "add linting")
    .option("--no-lint", "do not add linting");

  if (isRunningDevScript) {
    program.option("--remove", "remove folder after finish");
  }
  program.parse(process.argv);

  const output = { ...defaultOptions };

  const [nameFromCommand] = program.args;
  const options = program.opts<{
    withLint?: boolean;
    noLint?: boolean;
    remove?: boolean;
  }>();

  if (nameFromCommand) {
    output.name = nameFromCommand;
  } else {
    output.name = await promptProjectName();
  }

  if (!isProjectNameValid(output.name)) {
    console.error(
      `❌ ${chalk.red("Invalid project name! It should contains only letters, numbers, dashes and underscores.")}`
    );
    process.exit(0);
  }

  const fullPath = getFullPath(output.name);
  const isEmpty = await checkIfFolderIsEmpty(fullPath);
  if (!isEmpty) {
    console.error(`❌ ${chalk.red("Folder is not empty!")}`);
    process.exit(0);
  }

  if (options.withLint) {
    output.withLint = true;
  } else if (!options.noLint) {
    output.withLint = await promptWithLint();
  }

  if (isRunningDevScript && !options.remove) {
    const removeFolderAfterFinish = await promptRemoveFolderAfterFinish();

    if (removeFolderAfterFinish) {
      output.removeFolderAfterFinish = true;
    }
  }

  return output;
};
