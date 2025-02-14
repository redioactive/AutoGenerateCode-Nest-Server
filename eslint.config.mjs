import tseslint from '@typescript-eslint/eslint-plugin';
import eslint from 'eslint';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier';

export default [
  tseslint.config({
    ignores: ['eslint.config.mjs'],
  }),
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: './tsconfig.json',
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
];
