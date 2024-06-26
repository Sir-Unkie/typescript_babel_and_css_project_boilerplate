import CompressionPlugin from 'compression-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { merge } from 'webpack-merge';

import { baseConfig } from './base.config';
import { paths } from './paths';

const productionConfig = merge(baseConfig, {
  mode: 'production',

  devtool: false,

  output: {
    clean: true,
    filename: '[name].[contenthash].bundle.js',
    path: paths.appBuild,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -1,
        },
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
        },
      },
    },

    // ... spread built in js minimizer and add CSS minimizer plugin
    minimizer: [
      '...',
      new CssMinimizerPlugin({
        test: /\.css$/i,
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CompressionPlugin({ algorithm: 'gzip' }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
  ],
});

export default productionConfig;
