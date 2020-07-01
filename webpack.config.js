const package = require("./package.json");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    background: "./src/background_script.js",
    "page-action": "./src/page-action_vue.js",
    content: "./src/content_script.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: "../",
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/pageAction", to: "pageAction" },
        { from: "./src/icons", to: "icons" },
        { from: "./src/components", to: "components" },
        { from: "./src/options", to: "options" },
        { from: "./src/styles", to: "styles" },
        {
          from: "./src/manifest.json",
          to: "manifest.json",
          transform(buffer) {
            const manifest = JSON.parse(buffer.toString());
            // sync the manifest version with the npm package.json version
            manifest.version = package.version;
            return JSON.stringify(manifest, null, 2);
          },
        },
      ],
    }),
  ],
};
