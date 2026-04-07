import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    experimentalSortImports: {},
    ignorePatterns: ["dist"],
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
