# Ketyap UI

Accessible React components with fluid interactions, built on Base UI and distributed through a shadcn registry.

[Documentation](https://ui.ketyap.me) · [Source](https://github.com/ketyap/ui)

## Install a component

```bash
npx shadcn@latest add https://ui.ketyap.me/r/button.json
```

Each registry item includes its required Foundations, Hooks, and npm dependencies.

## Components

Accordion, Badge, Button, Checkbox, CheckboxGroup, ColorPicker, Dialog, DropdownMenu, Input, InputCopy, InputGroup, RadioGroup, Select, Slider, Switch, Table, Tabs, and Tooltip.

## Development

Use Node.js 24 or newer and the pnpm version pinned in `package.json`.

```bash
pnpm install
pnpm dev
```

- `pnpm build` — build the registry and documentation
- `pnpm registry:build` — generate the shadcn registry files
- `pnpm typecheck` — check TypeScript
- `pnpm check` — check Base UI usage, formatting, and lint

Components live in `components/ui`, examples in `examples/components`, and documentation in `content/docs`. `registry.json` defines the distributed items; `public/r` contains the generated registry files.

Interactive primitives use `@base-ui/react`. Compose with `render`; do not introduce Radix UI or `asChild` APIs.

## Credits and license

The documentation site began with the [startercn](https://github.com/shadcn-labs/startercn) template. Fluid Functionalism provides design and interaction references; components are independently implemented using Base UI and the shared Foundations.

[MIT](./LICENSE). Original copyright notices are preserved.
