#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chdir } from "node:process";
import path from "path";
import chalk from "chalk";

import { addLint } from "~/addons/lint";
import { baseDeps } from "~/config";
import { runCli } from "./cli";
import { runStep } from "./cli/step";
import { getFullPath, packageManagerCommands } from "./helpers";

const loadJSON = async (path: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(path, { encoding: "utf-8" })) as Record<
    string,
    unknown
  >;

const main = async () => {
  const initialCwd = process.cwd();
  const { name, withLint, packageManager } = await runCli();
  const fullPath = getFullPath(name);

  const projectName = fullPath.split("/").at(-1);
  const relativePath = path.relative(process.cwd(), fullPath);

  console.log(
    `Creating project ${chalk.blue(projectName)} at ./${relativePath}`
  );

  await mkdir(fullPath, { recursive: true });
  chdir(fullPath);

  const pkgManagerCommands = packageManagerCommands[packageManager];

  await runStep({
    command: "git init",
    description: "Initializing git repository...",
  });

  try {
    await runStep({
      command: pkgManagerCommands.init,
      description: `Initializing ${packageManager}...`,
    });
  } catch (err) {
    if ("code" in err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.code === 127) {
        console.error(
          chalk.red(
            `Package manager ${packageManager} not found. Please install it and try again.`
          )
        );
        process.exit(1);
      }
    }
  }

  await runStep({
    command: `${pkgManagerCommands.install} ${baseDeps.join(" ")} -D`,
    description: "Installing dependencies...",
  });

  await runStep({
    command: `${pkgManagerCommands.run} tsc --init`,
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
      exec: async () => addLint(packageManager),
    });
  }

  const runCdText = `Run ${chalk.blue(`cd ${relativePath}`)} to start!`;
  const wasProjectCreatedInCurrentFolder = fullPath === initialCwd;

  console.log(
    `\n🎉 Everything ready! ${wasProjectCreatedInCurrentFolder ? "" : runCdText}`
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
