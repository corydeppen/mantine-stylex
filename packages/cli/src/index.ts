import {
  DEFAULT_THEME,
  mergeMantineTheme,
  type MantineTheme,
  type MantineThemeOverride,
} from "@mantine/core";
import fs from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import invariant from "tiny-invariant";

function getSizeVariables(theme: MantineTheme, themeKey: keyof MantineTheme, name: string) {
  return Object.keys(theme[themeKey]).reduce((acc: Record<string, string>, size) => {
    acc[size] = `var(--mantine-${name}-${size})`;
    return acc;
  }, {});
}

/**
 * Collect Mantine theme variables to use when generating constants for StyleX.
 * @see https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/vanilla-extract/src/theme-to-vars.ts
 */
export function getThemeVariables(theme: MantineThemeOverride) {
  const mergedTheme = mergeMantineTheme(DEFAULT_THEME, theme);

  const fontSizes = getSizeVariables(mergedTheme, "fontSizes", "font-size");

  const lineHeights = getSizeVariables(mergedTheme, "lineHeights", "line-height");

  const shadows = getSizeVariables(mergedTheme, "shadows", "shadow");

  const radius = getSizeVariables(mergedTheme, "radius", "radius");

  const spacing = getSizeVariables(mergedTheme, "spacing", "spacing");

  const breakpoints = getSizeVariables(mergedTheme, "breakpoints", "breakpoint");

  const headings = Object.keys(mergedTheme.headings.sizes).reduce(
    (acc: Record<string, string>, heading) => {
      acc[`${heading}_fontSize`] = `var(--mantine-${heading}-font-size)`;
      acc[`${heading}_lineHeight`] = `var(--mantine-${heading}-line-height)`;
      acc[`${heading}_fontWeight`] = `var(--mantine-${heading}-font-weight)`;
      return acc;
    },
    {},
  );

  const colors = Object.keys(mergedTheme.colors).reduce(
    (acc: Record<string, string>, color) => {
      acc[`${color}_0`] = `var(--mantine-color-${color}-0)`;
      acc[`${color}_1`] = `var(--mantine-color-${color}-1)`;
      acc[`${color}_2`] = `var(--mantine-color-${color}-2)`;
      acc[`${color}_3`] = `var(--mantine-color-${color}-3)`;
      acc[`${color}_4`] = `var(--mantine-color-${color}-4)`;
      acc[`${color}_5`] = `var(--mantine-color-${color}-5)`;
      acc[`${color}_6`] = `var(--mantine-color-${color}-6)`;
      acc[`${color}_7`] = `var(--mantine-color-${color}-7)`;
      acc[`${color}_8`] = `var(--mantine-color-${color}-8)`;
      acc[`${color}_9`] = `var(--mantine-color-${color}-9)`;
      acc[`${color}Text`] = `var(--mantine-color-${color}-filled)`;
      acc[`${color}Filled`] = `var(--mantine-color-${color}-filled)`;
      acc[`${color}FilledHover`] = `var(--mantine-color-${color}-filled-hover)`;
      acc[`${color}Light`] = `var(--mantine-color-${color}-light)`;
      acc[`${color}LightHover`] = `var(--mantine-color-${color}-light-hover)`;
      acc[`${color}LightColor`] = `var(--mantine-color-${color}-light-color)`;
      acc[`${color}Outline`] = `var(--mantine-color-${color}-outline)`;
      acc[`${color}OutlineHover`] = `var(--mantine-color-${color}-outline-hover)`;
      return acc;
    },
    {
      white: "var(--mantine-color-white)",
      black: "var(--mantine-color-black)",
      text: "var(--mantine-color-text)",
      body: "var(--mantine-color-body)",
      error: "var(--mantine-color-error)",
      placeholder: "var(--mantine-color-placeholder)",
      anchor: "var(--mantine-color-anchor)",
      default: "var(--mantine-color-default)",
      defaultHover: "var(--mantine-color-default-hover)",
      defaultColor: "var(--mantine-color-default-color)",
      defaultBorder: "var(--mantine-color-default-border)",
      dimmed: "var(--mantine-color-dimmed)",
      disabledBody: "var(--mantine-color-disabled)",
      disabledText: "var(--mantine-color-disabled-color)",
      disabledBorder: "var(--mantine-color-disabled-border)",
      primary_0: "var(--mantine-primary-color-0)",
      primary_1: "var(--mantine-primary-color-1)",
      primary_2: "var(--mantine-primary-color-2)",
      primary_3: "var(--mantine-primary-color-3)",
      primary_4: "var(--mantine-primary-color-4)",
      primary_5: "var(--mantine-primary-color-5)",
      primary_6: "var(--mantine-primary-color-6)",
      primary_7: "var(--mantine-primary-color-7)",
      primary_8: "var(--mantine-primary-color-8)",
      primary_9: "var(--mantine-primary-color-9)",
      primaryText: "var(--mantine-primary-color-filled)",
      primaryFilled: "var(--mantine-primary-color-filled)",
      primaryFilledHover: "var(--mantine-primary-color-filled-hover)",
      primaryLight: "var(--mantine-primary-color-light)",
      primaryLightHover: "var(--mantine-primary-color-light-hover)",
      primaryLightColor: "var(--mantine-primary-color-light-color)",
      primaryOutline: "var(--mantine-primary-color-outline)",
      primaryOutlineHover: "var(--mantine-primary-color-outline-hover)",
    },
  );

  return {
    colors,
    breakpoints,
    spacing,
    fontSizes,
    lineHeights,
    shadows,
    radius,
    headings,
  };
}

export interface Options {
  theme: string;
  output: string;
}

function writeStyle(name: string, vars: any) {
  return `
export const ${name} = stylex.defineConsts({
  ${Object.entries(vars)
    .map(([k, v]) => `${k}: "${v}",`)
    .join("\n")}
});
  `;
}

function writeBreakpoints(name: "smallerThan" | "largerThan", vars: any, theme: MantineTheme) {
  return `
export const ${name} = stylex.defineConsts({
  ${Object.entries(vars)
    .map(
      ([k, _]) =>
        `${k}: "@media (${
          name === "smallerThan" ? "max-width" : "min-width"
        }: ${theme.breakpoints[k]})",`,
    )
    .join("\n")}
});
  `;
}

/**
 * Generate module to define StyleX static style constants.
 * @see https://stylexjs.com/docs/api/javascript/defineConsts
 * @see https://github.com/songkeys/tailwind-preset-mantine/blob/main/src/cli.js
 */
export async function generate(path: string, options: Options) {
  const pwd = process.cwd();

  invariant(path, "Path to a module that exports the Mantine theme must be provided");
  const themePath = resolve(pwd, path);
  const themeURL = pathToFileURL(themePath);
  const themeModule = await import(themeURL.href);
  const theme =
    themeModule.theme ??
    themeModule.default?.default ??
    themeModule.default ??
    themeModule.default?.theme ??
    themeModule.default?.default?.theme;

  invariant(
    theme,
    "No theme found in the input file; please ensure the file exports a valid theme object",
  );
  const { breakpoints, colors, fontSizes, headings, lineHeights, radius, shadows, spacing } =
    getThemeVariables(theme);

  const mergedTheme = mergeMantineTheme(DEFAULT_THEME, theme);

  invariant(options.output, "Output path must be provided");
  const outputPath = resolve(pwd, options.output);

  console.time("✅ Generated constants");
  fs.writeFileSync(
    outputPath,
    `
/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import * as stylex from "@stylexjs/stylex";

${writeStyle("colors", colors)}
${writeStyle("breakpoints", breakpoints)}
${writeStyle("spacing", spacing)}
${writeStyle("fontSizes", fontSizes)}
${writeStyle("lineHeights", lineHeights)}
${writeStyle("shadows", shadows)}
${writeStyle("radius", radius)}
${writeStyle("headings", headings)}

${writeBreakpoints("smallerThan", breakpoints, mergedTheme)}
${writeBreakpoints("largerThan", breakpoints, mergedTheme)}
    `,
    "utf-8",
  );
  console.timeEnd("✅ Generated constants");
}
