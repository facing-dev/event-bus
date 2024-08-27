// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const config = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig/tsconfig.lint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    }
  },
  {
    ignores: [
      "src/**/test.ts",
      "src/**/*.test.ts"
    ]
  }
);

export default config