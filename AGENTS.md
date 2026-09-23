# UI primitives

- Use `@base-ui/react` exclusively for interactive UI primitives, including overlays, menus, selection, search, drawers, and toast notifications.
- Do not introduce Radix UI, `@radix-ui/*`, Vaul, cmdk, Sonner, or adapters that preserve their APIs.
- Compose components with Base UI `render`, `useRender`, and `mergeProps`; do not add `asChild` APIs.
- Keep `components.json` on a `base-*` style. Inspect third-party registry items before adding them and migrate any non-Base UI primitives.
- Plain HTML and CSS are appropriate for presentational components that do not need an interactive primitive.
- Preserve the existing sound, motion, surface, shape, and size behavior when changing primitives.
- Run `pnpm check:ui-base`, `pnpm typecheck`, and `pnpm build` after primitive changes, and verify keyboard and pointer interactions.
