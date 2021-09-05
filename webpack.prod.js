const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode : 'production' ,

  output: {
    // output files to dist folder
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "images/[name].[contenthash].[ext]",
  },

  optimization: {
    minimize: true,
    minimizer: [
      // minimizing js files
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      // minimizing css files
      new CssMinimizerPlugin({
        include: /\/src/,
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      // minimizing html files
      new HtmlMinimizerPlugin({
        minimizerOptions: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
    ],
  },

  // plugins
  
  plugins: [
    // generating html templates
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["main", "vendors"],
    }),

    // extracting css files
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css",
    }),
  ],

  // modules

  module: {
    rules: [
      //polyfilling js with babel
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },

      // css and sass loaders + the css extractor plugin
      {
        test: /\.s[ac]ss$/i,
        use: [
          // mini css extractor
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "resolve-url-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      // html loader
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      // assets loader
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
      },

      // SVGs will be laoded inline
      {
        test: /\.svg/,
        type: "asset/inline",
      },
    ],
  },
});
