import { createEslintNextConfig } from '@/eslint/next/create-config.js';

const eslintNextTypeCheckedConfig = createEslintNextConfig({ typeChecked: true });

export default eslintNextTypeCheckedConfig;
