#!/usr/bin/env node
import { execSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { argv, chdir } from "node:process";
import path from "path";

import { addLint } from "~/addons/lint";
import { deps } from "~/config";

const loadJSON = async (path: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(path, { encoding: "utf-8" })) as Record<
    string,
    unknown
  >;

const main = async () => {
  const args = argv.slice(2);
  if (args.length < 1) {
    throw new Error("Usage: npx nicolas <directory_name> flags");
  }
  const [directoryName] = args;
  const fullPath = path.join(process.cwd(), directoryName);

  await mkdir(fullPath);
  chdir(fullPath);

  execSync("git init");
  execSync("pnpm init");
  execSync(`pnpm i ${deps.join(" ")} -D`);
  execSync("pnpm tsc --init");
  await mkdir(path.join(fullPath, "src"));
  await writeFile(path.join(fullPath, "src", "index.ts"), "");

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

  if (args.includes("--with-lint")) {
    await addLint();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
