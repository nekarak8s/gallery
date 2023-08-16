module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
    commonjs: true,
  },
  ignorePatterns: ['.eslintrc.js', 'webpack.config.js', 'node_modules/'], // match with tsconfig.json
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:css-import-order/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // typesciript setting
    project: true,
    tsconfigRootDir: './tsconfig.json',
    ecmaVersion: 6,
    // other setting
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'import',
    'unused-imports',
    'css-import-order',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    // eslint-import-resolver-typescript
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // eslint-import-resolver-typescript
      typescript: {
        // alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: true,
    },
  },
  rules: {
    '@typescript-eslint/no-var-requires': 0, // allow commonJS
    'import/no-unresolved': [
      2,
      {
        commonjs: true,
        amd: true,
        ignore: ['\\.(jpg|gif|svg|png|webp)$', '\\.(css|scss)$'],
      },
    ],
    'import/order': [
      2,
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react*', // react 관련 모듈 가장 앞으로
            group: 'builtin',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: [], // pathGroups에 정의한 패턴 중 제외하고 싶은 것
        alphabetize: {
          order: 'asc', // 알파벳 내림차순 정렬
          caseInsensitive: true, // 대소문작 구분 안함
        },
        'newlines-between': 'never', // import문은 모두 붙이기
      },
    ],
    // import and unused
    '@typescript-eslint/no-unused-vars': 0,
    'unused-imports/no-unused-imports': 2,
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
