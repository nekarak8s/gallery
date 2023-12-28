const path = require('path')

const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './',
  },
  externals: {
    react: 'React', // CDN에서 React 로드
    'react-dom': 'ReactDOM', // CDN에서 React DOM 로드
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules\/(?!(axios))/,
        loader: 'babel-loader',
      },
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
                exportLocalsConvention: 'camelCase',
              },
              sourceMap: true,
              importLoaders: 2,
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|webp)$/,
        use: [
          {
            loader: 'responsive-loader',
            options: {
              name: '[name]-[hash]-[width].[ext]',
              sizes: [320, 640, 960, 1200, 1900, 2400, 3500],
              placeholder: true,
              placeholderSize: 20,
              esModule: true,
              quality: 90,
              outputPath: './responsive-images',
            },
          },
        ],
        type: 'javascript/auto',
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    usedExports: true,
    // https://webpack.kr/plugins/split-chunks-plugin/
    splitChunks: {
      chunks: 'all',
      minSize: 1000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new Dotenv({
      path: '.env.production',
    }),
    new MiniCssExtractPlugin({ filename: 'main.css' }),
  ],
})
