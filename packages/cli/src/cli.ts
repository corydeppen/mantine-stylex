import { cac } from "cac";
import process from "node:process";

import pkg from "../package.json" with { type: "json" };
import { generate, type Options } from "./index";

const cli = cac(pkg.name).version(pkg.version).help();

cli
  .command("<theme>", "Path to module containing Mantine theme")
  .option("-o, --output <file>", "Specify output file for StyleX constants")
  .action((path: string, options: Options) => generate(path, options));

export async function runCLI() {
  cli.parse(process.argv, { run: false });

  try {
    cli.runMatchedCommand();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
