const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    background: "./src/background_script.js",
    content: "./src/content_script.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
