import { nextJsConfig } from "@repo/eslint-config/next-js";
import drizzle from "eslint-plugin-drizzle";
import pluginQuery from "@tanstack/eslint-plugin-query";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  ...pluginQuery.configs["flat/recommended"],
  {
    plugins: {
      drizzle,
    },
    rules: {
      ...drizzle.configs.all.rules,
    },
  },
];
