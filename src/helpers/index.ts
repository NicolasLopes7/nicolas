import { exec } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";

export const asyncExec = (command: string) => {
  return new Promise<void>((resolve, reject) => {
    exec(command, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const checkIfFolderIsEmpty = async (path: string) => {
  try {
    const files = await readdir(path);
    return files.length === 0;
  } catch (err) {
    return true;
  }
};

export const getFullPath = (name: string) => {
  if (name === ".") return process.cwd();

  return path.join(process.cwd(), name);
};

export const removeTrailingSlash = (str: string) => {
  if (str.length < 2) {
    return str;
  }

  if (str.endsWith("/")) {
    return str.slice(0, -1);
  }

  return str;
};

const nameRegExp = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

export const isProjectNameValid = (name: string) => {
  const withoutTrailingSlash = removeTrailingSlash(name);
  const pathSegments = withoutTrailingSlash.split("/");

  const projectName = pathSegments.at(-1);

  if ([".", ""].includes(projectName)) {
    return true;
  }

  return nameRegExp.test(projectName);
};

export const packageManagerCommands = {
  pnpm: {
    init: "pnpm init",
    install: "pnpm install",
    run: "pnpm",
  },
  yarn: {
    init: "yarn init -y",
    install: "yarn add",
    run: "yarn",
  },
  npm: {
    init: "npm init -y",
    install: "npm install",
    run: "npx",
  },
};
