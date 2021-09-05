const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  mode: "development",

  output: {
    // output files to dist folder
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "images/[name].[contenthash].[ext]",
  },

  // plugins

  plugins: [
    // generating html templates
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["main", "vendors"],
    }),
  ],

  // modules

  module: {
    rules: [
      //polyfilling js with babel
      //   {
      //     test: /\.js$/,
      //     exclude: /(node_modules)/,
      //     use: {
      //       loader: "babel-loader",
      //       options: {
      //         presets: ["@babel/preset-env"],
      //       },
      //     },
      //   },

      // css and sass loaders
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true, // needed for the resolve-url-loader to work
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
