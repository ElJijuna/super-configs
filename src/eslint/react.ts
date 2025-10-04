import base from "./base";
import type { Linter } from "eslint";

const config: Linter.BaseConfig = {
  ...base,
  plugins: ["react", "react-hooks"],
  extends: [
    ...(base.extends || []),
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  settings: { react: { version: "detect" } },
  rules: {
    ...(base.rules || {}),
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off"
  }
};

export default config;
