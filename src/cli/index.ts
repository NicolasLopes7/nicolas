import chalk from "chalk";
import { Command } from "commander";

import {
  checkIfFolderIsEmpty,
  getFullPath,
  isProjectNameValid,
} from "~/helpers";
import {
  promptPackageManager,
  promptProjectName,
  promptWithLint,
} from "./prompts";

interface CliOutput {
  name: string;
  withLint: boolean;
  packageManager: "pnpm" | "yarn" | "npm";
}

const defaultOptions: CliOutput = {
  name: "nicolas",
  withLint: false,
  packageManager: "pnpm",
};

export const runCli = async (): Promise<CliOutput> => {
  const program = new Command()
    .name("nicolas")
    .argument("[name]", "name of the project")
    .option("--with-lint", "add linting")
    .option("--no-lint", "do not add linting")
    .option("--pnpm", "use pnpm as package manager")
    .option("--yarn", "use yarn as package manager")
    .option("--npm", "use npm as package manager");

  program.parse(process.argv);

  const output = { ...defaultOptions };

  const [nameFromCommand] = program.args;
  const options = program.opts<{
    withLint?: boolean;
    noLint?: boolean;
    pnpm?: boolean;
    yarn?: boolean;
    npm?: boolean;
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

  const packageManagerFromCommand = ["pnpm", "yarn", "npm"].find((pkg) =>
    Object.keys(options).includes(pkg)
  ) as "pnpm" | "yarn" | "npm";

  if (packageManagerFromCommand) {
    output.packageManager = packageManagerFromCommand;
  } else {
    output.packageManager = await promptPackageManager();
  }

  return output;
};
