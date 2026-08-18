import { createEslintExpoConfig } from '@/eslint/expo/create-config.js';

const eslintExpoTypeCheckedConfig = createEslintExpoConfig({ typeChecked: true });

export default eslintExpoTypeCheckedConfig;
