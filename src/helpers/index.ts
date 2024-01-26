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
  return path.join(process.cwd(), name);
};
