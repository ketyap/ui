import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, react, next, vitest],
  ignorePatterns: [
    "public/r/**",
    ".agents/**",
    ".cursor/**",
    ".changeset/**",
    ".claude/**",
    ".web-kits/**",
    "audio/**",
  ],
  overrides: [
    {
      // DOM styles are mutable; value changes must trigger a new measurement.
      files: ["hooks/use-auto-resize-textarea.ts"],
      rules: {
        "react/exhaustive-effect-dependencies": "off",
        "react/immutability": "off",
        "unicorn/prefer-number-coercion": "off",
      },
    },
    {
      // Callback refs and composed viewport props are passed through, never read.
      files: ["components/ui/slider.tsx", "components/ui/scroll-area.tsx"],
      rules: { "react/refs": "off" },
    },
    {
      // Children changes intentionally trigger DOM measurement again.
      files: ["components/ui/tabs.tsx", "components/ui/fluid-hover-area.tsx"],
      rules: { "react/exhaustive-effect-dependencies": "off" },
    },
    {
      // Synchronize browser-only state after hydration and controlled input drafts.
      files: [
        "hooks/use-is-mac.ts",
        "hooks/use-mobile.ts",
        "hooks/use-media-query.tsx",
        "components/ui/color-picker.tsx",
      ],
      rules: { "react/set-state-in-effect": "off" },
    },
    {
      // Pagination must stop on the first empty page or failed request.
      files: ["lib/github.ts"],
      rules: { "eslint/no-await-in-loop": "off" },
    },
  ],
  rules: {
    // Preserve the project's component composition and naming conventions.
    "eslint/prefer-named-capture-group": "off",
    "jsx-a11y/prefer-tag-over-role": "off",
    "react/function-component-definition": "off",
    "react/hook-use-state": "off",
    "react/jsx-no-constructed-context-values": "off",
    "react/no-react-children": "off",
  },
});
