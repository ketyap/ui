import path from "node:path";

import { readFileFromRoot } from "@/lib/read-file";
import registry from "@/registry.json";

export const readOptionalFromRoot = async (
  relativePath: string
): Promise<string | null> => {
  try {
    return await readFileFromRoot(relativePath);
  } catch {
    return null;
  }
};

export const getDemoSource = (name: string): Promise<string | null> =>
  readOptionalFromRoot(path.join("examples", "components", `${name}.tsx`));

export const getRegistrySource = (name: string): Promise<string | null> => {
  const item = registry.items.find((entry) => entry.name === name);
  const file = item?.files?.find((entry) => entry.type === item.type);
  return file ? readOptionalFromRoot(file.path) : Promise.resolve(null);
};
