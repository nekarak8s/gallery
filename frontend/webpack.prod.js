const path = require('path')

const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const crypto = require('crypto')

const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[contenthash].js',
  },
  // externals: {
  //   react: 'React', // CDN에서 React 로드
  //   'react-dom': 'ReactDOM', // CDN에서 React DOM 로드
  // },
  devtool: 'nosources-source-map',
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
        resourceQuery: /format=(png|jpe?g|webp)$/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000, // 20kb
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 100000, // 100kb
      cacheGroups: {
        reactPackage: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          name: 'vendor_react',
          chunks: 'all',
          priority: 10,
          filename: 'vendor_react.js',
        },
        threePackage: {
          test: /[\\/]node_modules[\\/](three.*|gsap)[\\/]/,
          name: 'vendor_three',

          priority: 7,
          filename: 'vendor_three.js',
        },
        apiPackage: {
          test: /[\\/]node_modules[\\/](.*query.*|axios)[\\/]/,
          name: 'vendor_api',
          priority: 5,
          filename: 'vendor_api.js',
        },
        vendors: {
          test(module) {
            return module.size() > 150000 && /node_modules[/\\]/.test(module.identifier())
          },
          name(module, chunks, cacheGroupKey) {
            const hash = crypto.createHash('sha256').update(module.identifier()).digest('hex').substring(0, 8)
            return `vendor-${hash}`
          },
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -30,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new Dotenv({
      path: '.env.production',
    }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css', chunkFilename: '[id].[contenthash].css' }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|jsx|ts|tsx|css|html|svg)$/,
    }),
  ],
})
