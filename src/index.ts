#!/usr/bin/env node
import { execSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chdir } from "node:process";
import path from "path";
import chalk from "chalk";

import { addLint } from "~/addons/lint";
import { deps } from "~/config";
import { runCli } from "./cli";

const loadJSON = async (path: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(path, { encoding: "utf-8" })) as Record<
    string,
    unknown
  >;

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

const nicolau = chalk.blue("[Nicolau]");

const runStep = async (step: StepOptions) => {
  console.log(`${nicolau} ${step.description}`);
  if ("command" in step) {
    const stdout = execSync(step.command);
    process.stdout.write(stdout);
  } else {
    await step.exec();
  }

  console.log(`✅ ${chalk.green("Done")}\n\n`);
};

const main = async () => {
  const { name } = await runCli();
  const fullPath = path.join(process.cwd(), name);

  console.log(
    `Creating project ${chalk.blue(name)} at ${chalk.blue("./" + name)}...`
  );

  await mkdir(fullPath);
  chdir(fullPath);

  await runStep({
    command: "git init",
    description: "Initializing git repository...",
  });

  await runStep({
    command: "pnpm init",
    description: "Initializing pnpm...",
  });

  await runStep({
    command: `pnpm i ${deps.join(" ")} -D`,
    description: "Installing dependencies...",
  });

  await runStep({
    command: `pnpm tsc --init`,
    description: "Initializing tsconfig...",
  });

  await runStep({
    description: "Creating src/index.ts...",
    exec: async () => {
      await mkdir(path.join(fullPath, "src"));
      await writeFile(path.join(fullPath, "src", "index.ts"), "");
    },
  });

  await runStep({
    description: "Creating package.json",
    exec: async () => {
      const packageJson = await loadJSON(path.join(fullPath, "package.json"));

      packageJson.scripts = {
        dev: "tsx --watch src/index.ts",
        build: "tsup",
        start: "node dist/index.js",
      };

      await writeFile(
        path.join(fullPath, "package.json"),
        JSON.stringify(packageJson, null, 2)
      );
    },
  });

  console.log(
    `${nicolau} Everything ready! Run ${chalk.blue(`cd ${name}`)} to start!`
  );

  if (args.includes("--with-lint")) {
    await addLint();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
