import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["./src/{index,run}.ts"],
    exports: true,
  },
});
