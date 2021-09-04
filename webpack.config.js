const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// setting multiple html plugins

let htmlPageNames = []; //pages names

let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/${name}.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
  });
});

module.exports = {
  mode: "development",

  // multiple entry points
  entry: {
    main: [
       "./src/main.js" , // main js file
       "./src/app.scss"
    ], 
    vendors: "./src/vendors.js", // js vendors like lodash , ramda etc
  },

  output: {
    // output files to dist folder
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "images/[hash][ext][query]",
  },

  // plugins

  plugins: [
    // multiple html plugins
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["main", "vendors"],
    }),

    // mini css extractor plugin
    new MiniCssExtractPlugin({ 
      filename: "/styles/[name].[contenthash].css" 
    }),

  ].concat(multipleHtmlPlugins),

  // modules

  module: {
    rules: [
      // css ,sass and style loaders
      {
        test: /\.s[ac]ss$/i,

        use: [
          // mini css extractor
          MiniCssExtractPlugin.loader,
          //"style-loader" ,
          "css-loader",
          "sass-loader",
        ],
      },

      // html loaders
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      // file loaders
      // the new way to handle assets in webpack 5
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        test: /\.svg/,
        type: "asset/inline",
      },
    ],
  },
};

/*
* this is used to load assets on webpack 4

{
  test: /\.(png|jpe?g|gif)$/i,
  loader: "file-loader",
  dependency: { not: ['url'] }, // needed for webpack 5
  options: {
    name: "[name][contentHash][ext]",
    outputPath: "assets" ,
  },
  type: 'javascript/auto' // needed for webpack 5
},
*/
