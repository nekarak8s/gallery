module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
    commonjs: true,
  },
  ignorePatterns: ['.eslintrc.js', 'webpack.*.js', 'node_modules/'], // match with tsconfig.json
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:css-import-order/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // typesciript settings
    project: true,
    tsconfigRootDir: './tsconfig.json',
    ecmaVersion: 6,
    // other settings
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
    // typescirpt import parser
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    // typescript import resolver(eslint-import-resolver-typescript)
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: true,
    },
  },
  rules: {
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/no-var-requires': 0, // allow commonJS
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unnecessary-type-assertion': 0,
    'import/no-unresolved': [
      2,
      {
        commonjs: true,
        amd: true,
        ignore: ['\\.(jpg|gif|svg|png|webp)$', '\\.(css|scss)$'],
      },
    ],
    // import/order
    'import/order': [
      2,
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'builtin',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'never',
      },
    ],
    // unused-imports
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
