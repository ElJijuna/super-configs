declare const jestConfig: {
  testEnvironment: string;
  transform: Record<string, [string, Record<string, unknown>]>;
  moduleFileExtensions: string[];
  verbose: boolean;
};

export default jestConfig;
