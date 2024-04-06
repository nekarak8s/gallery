const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: './src/index.tsx',
  output: {
    assetModuleFilename: 'images/[name][hash][ext][query]',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  resolveLoader: {
    alias: {
      rl: 'responsive-loader',
    },
  },
  module: {
    rules: [
      {
        test: /\.(webm|mp4|mp3|glb|gltf|wasm)$/,
        type: 'asset', // https://webpack.js.org/guides/asset-modules/
        parser: {
          dataUrlCondition: {
            maxSize: 1 * 1024, // 1kb
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
              svgo: {
                plugins: [
                  {
                    removeViewBox: false, // enable viewBox
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
}
