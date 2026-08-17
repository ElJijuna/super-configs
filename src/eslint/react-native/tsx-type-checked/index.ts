import { createEslintReactNativeConfig } from '@/eslint/react-native/create-config.js';

const eslintReactNativeTsxTypeCheckedConfig = createEslintReactNativeConfig('ts', {
  typeChecked: true,
});

export default eslintReactNativeTsxTypeCheckedConfig;
