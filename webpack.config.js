import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { filename, globalVar, version } from './dll.js';

export default {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(process.cwd(), 'dist/dll', version),
    library: globalVar,
    libraryTarget: 'umd',
    filename: `${filename}.[contenthash].js`,
  },
  externals: Object.fromEntries(
    [
      '@material-ui/core',
      '@material-ui/styles',
      'react',
      'react-dom',
      'react-intl',
      '@emotion/react',
      '@emotion/core',
      '@mui/x-date-pickers',
      '@emotion/styled',
      '@mui/base',
      '@mui/material'
    ].map((name) => [name, `${globalVar}_${name}`])
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@postinumero/experimental',
              '@visma/formatjs',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${filename}.[contenthash].css`,
    }),
    new WebpackManifestPlugin(),
  ],
};
