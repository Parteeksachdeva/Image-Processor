const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // Entry point for your server application
  entry: "./src/server.ts",

  // Output configuration
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },

  // Module resolution configuration
  resolve: {
    extensions: [".ts", ".js"], // Resolve these extensions
  },

  // Rules for module processing
  module: {
    rules: [
      {
        test: /\.ts$/, // Handle TypeScript files
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/, // Optionally handle JavaScript files if needed
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },

  // Plugins for additional functionality
  plugins: [
    new CleanWebpackPlugin(), // Clean output directory before each build
  ],

  // Target environment
  target: "node",

  // Source maps for debugging
  devtool: "source-map",

  // Optimization options
  optimization: {
    minimize: false, // Set to true for production build
  },

  // Node-specific configuration
  node: {
    __dirname: false,
    __filename: false,
  },
};
