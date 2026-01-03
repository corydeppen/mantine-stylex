import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/{index,run}.ts"],
  exports: true,
});
