import { exec } from "node:child_process";

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
