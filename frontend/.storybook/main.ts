import type { StorybookConfig } from '@storybook/react-webpack5'
import develop from '../webpack.dev.js'
import production from '../webpack.prod.js'
import { getParsedCommandLineOfConfigFile } from 'typescript'

const path = require('path')

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack',
    {
      name: '@storybook/addon-styling-webpack',

      options: {
        rules: [
          {
            test: /\.css$/,
            sideEffects: true,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {},
              },
            ],
          },
        ],
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, { configType }) => {
    // modify storybook's file-loader rule to avoid conflicts with your inline svg
    const rules = config.module.rules

    const fileLoaderRule = rules.find((rule) => rule.test.test('.svg'))
    fileLoaderRule.exclude = /\.svg$/

    if (configType === 'DEVELOPMENT') {
      config = {
        ...config,
        module: { ...config.module, rules: [...config.module.rules, ...develop.module.rules] },
      }
    }
    if (configType === 'PRODUCTION') {
      config = {
        ...config,
        module: {
          ...config.module,
          rules: [...config.module.rules, ...production.module.rules],
        },
        plugins: [...config.plugins, ...production.plugins],
      }
    }

    // Modify alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    }

    return config
  },
}
export default config
