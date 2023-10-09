const path = require('path')

const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: './',
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
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new Dotenv({
      path: '.env.production',
    }),
    new MiniCssExtractPlugin({ filename: 'main.css' }),
    new BundleAnalyzerPlugin(),
  ],
})
