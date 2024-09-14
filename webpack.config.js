const path = require("path");

module.exports = {
  entry: "./js/homepage.js",
  watch: true,
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
