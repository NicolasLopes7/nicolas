import ora from "ora";

import { asyncExec } from "~/helpers";

type StepOptions = {
  description: string;
} & (
  | {
      exec: () => Promise<void>;
    }
  | {
      command: string;
    }
);

export const runStep = async (step: StepOptions) => {
  const spinner = ora(step.description).start();

  if ("command" in step) {
    await asyncExec(step.command);
  } else {
    await step.exec();
  }

  spinner.succeed();
};
