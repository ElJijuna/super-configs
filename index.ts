export { default as eslintBase } from "./src/eslint/base.js";
export { default as eslintReact } from "./src/eslint/react.js";
export { default as eslintTs } from "./src/eslint/ts.js";
export { default as eslintTsReact } from "./src/eslint/ts-react.js";

export { default as prettier } from "./src/prettier/index.json" assert { type: "json" };

export { default as jestConfig } from "./src/test/jest.config.js";
export { default as vitestConfig } from "./src/test/vitest.config";
export { default as bunTestConfig } from "./src/test/bun.config.js";

export { default as tsBase } from "./src/tsconfig/base.json" assert { type: "json" };
export { default as tsNode } from "./src/tsconfig/node.json" assert { type: "json" };
export { default as tsReact } from "./src/tsconfig/react.json" assert { type: "json" };
