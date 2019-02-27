const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    background: "./src/background_script.js",
    content: "./src/content_script.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CopyPlugin([
      { from: "./src/browserAction", to: "browserAction" },
      { from: "./src/icons", to: "icons" },
      { from: "./src/options", to: "options" },
      { from: "./src/pageAction", to: "pageAction" },
      { from: "./src/manifest.json", to: "manifest.json" }
    ])
  ]
};
