const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const packageJson = require("./package.json");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = function(_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    devtool: isDevelopment && "cheap-module-source-map",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "app.js",
      publicPath: "http://localhost:8080/assets/js"
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              envName: isProduction ? "production" : "development"
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader"
          ]
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "static/media/[name].[hash:8].[ext]"
            }
          }
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          loader: require.resolve("file-loader"),
          options: {
            name: "static/media/[name].[hash:8].[ext]"
          }
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx", ".txt", ".png", ".css", ".html", ".md", "*"]
    },
    plugins: [
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "http://localhost:8080/assets/css/[name].[contenthash:8].css",
          chunkFilename: "http://localhost:8080/assets/css/[name].[contenthash:8].chunk.css"
        }),
      new HtmlWebpackPlugin({
        filename: "./index.html",
        template: path.resolve(__dirname, "index.html"),
        inject: true
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        )
      }),
      new webpack.ProvidePlugin({ React: "react", }),
    ].filter(Boolean),
    stats: {
      errorDetails: true,
      children: true
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      open: true,
      overlay: true
    }
  };
};
