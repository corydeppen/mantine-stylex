# mantine-stylex

Write styles in your application using [StyleX](https://stylexjs.com/) and easily reference [Mantine](https://mantine.dev/) design system variables in a type-safe manner.

## Installation

```sh
pnpm add -D mantine-stylex
```

Learn more about [thinking in StyleX](https://stylexjs.com/docs/learn/thinking-in-stylex) and [how to install](https://stylexjs.com/docs/learn/installation) it in your project.

## Usage

Create a Mantine theme file:

```ts
// src/styles/theme.ts
import { createTheme } from "@mantine/core";

const theme = createTheme({
  colors: {
    brand: [
      "#e6f7ff",
      "#bae7ff",
      "#91d5ff",
      "#69c0ff",
      "#40a9ff",
      "#1890ff",
      "#096dd9",
      "#0050b3",
      "#003a8c",
      "#002766",
    ],
  },
  // ...
});
```

Generate a module that exports StyleX constants:

```sh
pnpx mantine-stylex src/styles/theme.ts -o src/styles/vars.stylex.ts
```

The generated module will contain exports that allow Mantine variables to be used in a type-safe manner when defining styles:

```ts
// src/styles/mantine.stylex.ts
export const colors = stylex.defineConsts({
  text: "var(--mantine-color-text)",
  // ...
});
```

Use the StyleX constants in your application:

```tsx
// src/Welcome/Welcome.tsx
import { Title } from "@mantine/core";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/styles/mantine.stylex";

export function Welcome() {
  return <Title {...stylex.props(styles.title)}>Welcome</Title>;
}

const styles = stylex.create({
  title: {
    color: colors.text,
    fontWeight: 900,
  },
});
```

## License

MIT
