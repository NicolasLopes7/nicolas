import { Command } from "commander";

import { promptProjectName } from "./promptProjectName";

interface CliOutput {
  name: string;
}

const defaultOptions: CliOutput = {
  name: "nicolas",
};

export const runCli = async (): Promise<CliOutput> => {
  const program = new Command()
    .name("nicolas")
    .argument("[dir]", "name of the project");
  program.parse(process.argv);

  const output = { ...defaultOptions };

  const [nameFromCommand] = program.args;
  if (nameFromCommand) {
    output.name = nameFromCommand;
  }

  if (!nameFromCommand) {
    output.name = await promptProjectName();
  }

  return output;
};
