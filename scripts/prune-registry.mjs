import { readFileSync, readdirSync, unlinkSync } from "node:fs";

const registry = JSON.parse(
  readFileSync(new URL("../registry.json", import.meta.url), "utf-8")
);
const output = new URL("../public/r/", import.meta.url);
const expected = new Set([
  "registry.json",
  ...registry.items.map((item) => `${item.name}.json`),
]);

for (const entry of readdirSync(output, { withFileTypes: true })) {
  if (
    entry.isFile() &&
    entry.name.endsWith(".json") &&
    !expected.has(entry.name)
  ) {
    unlinkSync(new URL(entry.name, output));
    console.log(`Removed stale registry item: ${entry.name}`);
  }
}
