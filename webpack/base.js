const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {
  DefinePlugin,
  optimize
} = require('webpack');
const GenerateJsonFromJsPlugin = require('generate-json-from-js-webpack-plugin');
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
const {
  join
} = require('path');
const dotenv = require('dotenv');

const prodPlugins = [],
  isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  prodPlugins.push(new optimize.AggressiveMergingPlugin(), new optimize.OccurrenceOrderPlugin());
}

const Root = join(__dirname, '..');
const Source = join(Root, 'src');
const Dist = join(Root, 'dist');

const Assets = join(Source, 'assets');
const Background = join(Source, 'background');
const Content = join(Source, 'content');
const Popup = join(Source, 'popup');
const Lib = join(Source, 'lib');
const Option = join(Source, 'option');

const config = {
  mode: process.env.NODE_ENV,
  target: 'web',
  devtool: isProd ? 'none' : 'cheap-source-map',
  entry: {
    background: join(Background, 'index.ts'),
    popup: join(Popup, 'index.tsx'),
    content: join(Content, 'index.tsx'),
    option: join(Option, 'index.tsx'),
  },
  output: {
    path: join(__dirname, '../', 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                // { "pragma":"h" }
              ]
            ]
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]',
          },
        }, ],
      },
      {
        test: /\.(gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
          },
        }],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.pcss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          'postcss-loader'
        ],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(
        dotenv.config({
          path: join(Root, `.env.${process.env.TARGET_ENV || process.env.NODE_ENV}`),
        }).parsed,
      ),
    }),
    new CopyPlugin({
      patterns: [{
          from: join(Assets, 'html'),
          to: 'assets/html',
        },
        {
          from: join(Assets, 'images'),
          to: 'assets/images',
        },
        {
          from: join(Assets, 'json'),
          to: 'assets/json',
        }
      ]
    }),
    ...(process.env.STATS ? [new BundleAnalyzerPlugin()] : []),
    ...prodPlugins,
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.png', '.svg', '.gql'],
    alias: {
      lib: Lib,
      background: Background,
      content: Content,
      popup: Popup,
      assets: Assets,
      option: Option,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false
    })],
  }
};

const buildConfig = (browser, path) => ({
  ...config,
  name: browser,
  output: {
    path: join(Dist, path || browser),
    filename: '[name].js',
  },
  plugins: [
    ...config.plugins,
    new GenerateJsonFromJsPlugin({
      path: join(Source, 'manifest', `${browser}.js`),
      filename: 'manifest.json',
    }),
  ],
});

module.exports = {
  config,
  buildConfig,
};