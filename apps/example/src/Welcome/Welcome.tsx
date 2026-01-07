import { Title, Text, Anchor } from "@mantine/core";
import * as stylex from "@stylexjs/stylex";

// importing using an alias doesn't work (yet)
// https://github.com/facebook/stylex/issues /40
// import { colors } from "@/mantine.stylex";
import { colors } from "../mantine.stylex";

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
    color: colors.text,
    fontWeight: 900,
    fontSize: {
      // functions aren't supported (yet)
      // https://github.com/facebook/stylex/issues /1358
      // default: rem(100),
      default: "calc(6.25rem * var(--mantine-scale))" /*rem(100)*/,
      // computed property keys aren't reliable (yet)
      // https://github.com/facebook/stylex/issues /1414
      // [smallerThan.md]: rem(50),
      "@media (max-width: 62em)": "calc(3.125rem * var(--mantine-scale))",
    },
    letterSpacing: "calc(-0.125rem * var(--mantine-scale))" /*rem(-2)*/,
  },
});
