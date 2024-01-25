import { Command } from "commander";

import { promptProjectName } from "./promptProjectName";
import { promptWithLint } from "./promptWithLint";

interface CliOutput {
  name: string;
  withLint: boolean;
}

const defaultOptions: CliOutput = {
  name: "nicolas",
  withLint: false,
};

export const runCli = async (): Promise<CliOutput> => {
  const program = new Command()
    .name("nicolas")
    .argument("[name]", "name of the project")
    .option("--with-lint", "add linting")
    .option("--no-lint", "do not add linting");
  program.parse(process.argv);

  const output = { ...defaultOptions };

  const [nameFromCommand] = program.args;
  const options = program.opts<{ withLint?: boolean; noLint?: boolean }>();

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

  return output;
};
