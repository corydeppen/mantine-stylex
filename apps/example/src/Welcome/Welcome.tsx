import { Title, Text, Anchor } from "@mantine/core";
import * as stylex from "@stylexjs/stylex";

import { colors, smallerThan } from "../vars.stylex";

export function Welcome() {
  return (
    <>
      <Title {...stylex.props(styles.title)} ta="center" mt={100}>
        Welcome to{" "}
        <Text inherit variant="gradient" component="span" gradient={{ from: "pink", to: "yellow" }}>
          Mantine
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This starter Vite project includes a minimal setup, if you want to learn more on Mantine +
        Vite integration follow{" "}
        <Anchor href="https://mantine.dev/guides/vite/" size="lg">
          this guide
        </Anchor>
        . To get started edit Welcome/Welcome.tsx file.
      </Text>
    </>
  );
}

const styles = stylex.create({
  title: {
    color: `light-dark(${colors.black}, ${colors.white})`,
    fontWeight: 900,
    fontSize: {
      // functions currently aren't supported by StyleX
      default: "calc(6.25rem * var(--mantine-scale))" /*rem(100)*/,
      [smallerThan.md]: "calc(3.125rem * var(--mantine-scale))" /*rem(50)*/,
    },
    letterSpacing: "calc(-0.125rem * var(--mantine-scale))" /*rem(-2)*/,
  },
});
