#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chdir } from "node:process";
import path from "path";
import chalk from "chalk";

import { addLint } from "~/addons/lint";
import { deps } from "~/config";
import { runCli } from "./cli";
import { runStep } from "./cli/step";
import { asyncExec, getFullPath } from "./helpers";

const loadJSON = async (path: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(path, { encoding: "utf-8" })) as Record<
    string,
    unknown
  >;

const main = async () => {
  const initialCwd = process.cwd();
  const { name, withLint, removeFolderAfterFinish } = await runCli();
  const fullPath = getFullPath(name);

  const projectName = fullPath.split("/").at(-1);
  const relativePath = path.relative(process.cwd(), fullPath);

  console.log(
    `Creating project ${chalk.blue(projectName)} at ./${relativePath}`
  );

  await mkdir(fullPath, { recursive: true });
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

  if (withLint) {
    await runStep({
      description: "Setting up linting...",
      exec: addLint,
    });
  }

  const runCdText = `Run ${chalk.blue(`cd ${relativePath}`)} to start!`;
  const wasProjectCreatedInCurrentFolder = fullPath === initialCwd;

  console.log(
    `\n🎉 Everything ready! ${wasProjectCreatedInCurrentFolder ? "" : runCdText}`
  );

  if (removeFolderAfterFinish) {
    await runStep({
      description: "Removing folder...",
      exec: async () => {
        await asyncExec(`rm -rf ${fullPath}`);
      },
    });
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
