import { mkdir, PathLike } from "fs";
import { exec } from "child_process";

type Resolve = (path: string) => void;
type Reject = (err: NodeJS.ErrnoException) => void;

export const mkdirPromise = (path: PathLike, mode?: string | number) => {
  return new Promise((resolve: Resolve, reject: Reject) => {
    mkdir(path, mode, (err) => {
      if (err) {
        reject(err);
      } else {
        const pathstring = typeof path === "string" ? path : path.toString();
        resolve(pathstring);
      }
    });
  });
};

export const execPromise = (command: string) => {
  return new Promise((resolve: Resolve, reject: Reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};
