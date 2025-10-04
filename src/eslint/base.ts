import type { Linter } from "eslint";

const config: Linter.BaseConfig = {
  env: { browser: true, es2022: true, node: true },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": "warn",
    "no-console": "warn",
    eqeqeq: ["error", "always"]
  }
};

export default config;
