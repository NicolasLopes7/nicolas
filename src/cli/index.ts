import { Command } from "commander";

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
