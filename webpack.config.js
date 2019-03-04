const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: {
    background: "./src/background_script.js",
    "browser-action": "./src/browser-action_script.js",
    content: "./src/content_script.js",
    "extension-page": "./src/extension-page_script.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: "../"
            }
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyPlugin([
      { from: "./src/browserAction", to: "browserAction" },
      { from: "./src/extensionPage", to: "extensionPage" },
      { from: "./src/icons", to: "icons" },
      { from: "./src/options", to: "options" },
      { from: "./src/styles", to: "styles" },
      { from: "./src/pageAction", to: "pageAction" },
      { from: "./src/manifest.json", to: "manifest.json" }
    ])
  ]
};
