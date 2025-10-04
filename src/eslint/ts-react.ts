import ts from "./ts";
import react from "./react";
import type { Linter } from "eslint";

const config: Linter.BaseConfig = {
  ...ts,
  ...react,
  extends: [
    ...(ts.extends || []),
    ...(react.extends || []),
    "plugin:prettier/recommended"
  ]
};

export default config;
