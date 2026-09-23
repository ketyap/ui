import { promises as fs } from "node:fs";
import path from "node:path";

export const readFileFromRoot = (relativePath: string) => {
  // Source directories are explicitly included by outputFileTracingIncludes.
  const absolutePath = path.join(
    /* turbopackIgnore: true */
    process.cwd(),
    relativePath
  );
  return fs.readFile(absolutePath, "utf-8");
};
