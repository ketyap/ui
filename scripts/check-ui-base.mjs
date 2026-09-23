import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);
const config = JSON.parse(
  readFileSync(new URL("../components.json", import.meta.url), "utf-8")
);
const forbidden = /^(?:radix-ui|@radix-ui\/.*|vaul|cmdk|sonner)$/u;
const errors = [];
for (const dependency of Object.keys({
  ...manifest.dependencies,
  ...manifest.devDependencies,
})) {
  if (forbidden.test(dependency)) {
    errors.push(`Forbidden UI dependency: ${dependency}`);
  }
}
if (!config.style.startsWith("base-")) {
  errors.push("components.json must use a base-* style");
}
const scan = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      scan(file);
    } else if (/\.(?:tsx?|jsx?|mdx|json)$/u.test(entry.name)) {
      const source = readFileSync(file, "utf-8");
      if (
        /["'](?:radix-ui|@radix-ui\/[^"']+|vaul|cmdk|sonner)(?:\/[^"']*)?["']|--radix-|\basChild\b/u.test(
          source
        )
      ) {
        errors.push(`Non-Base UI primitive API in ${file}`);
      }
    }
  }
};
for (const directory of [
  "app",
  "components",
  "hooks",
  "lib",
  "examples",
  "content",
  "public/r",
]) {
  scan(path.join(root, directory));
}
const lockfile = readFileSync(path.join(root, "pnpm-lock.yaml"), "utf-8");
if (/^\s+['"]?(?:@radix-ui\/|radix-ui@|vaul@|cmdk@|sonner@)/mu.test(lockfile)) {
  errors.push(
    "Lockfile contains a forbidden UI dependency (including transitive dependencies)"
  );
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("UI primitives: Base UI only.");
}
