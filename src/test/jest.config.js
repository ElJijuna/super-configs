export default {
  testEnvironment: "node",
  transform: { "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }] },
  moduleFileExtensions: ["ts", "js", "json"],
  verbose: true
};
