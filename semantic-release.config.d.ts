declare const semanticReleaseConfig: {
  branches: string[];
  plugins: (string | [string, Record<string, unknown>])[];
};

export default semanticReleaseConfig;
