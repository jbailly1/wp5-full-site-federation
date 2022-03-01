const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const DashboardPlugin = require("@module-federation/dashboard-plugin");
const path = require('path');

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    // publicPath: "http://localhost:8082/",
    filename: 'checkout.js'
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8082,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "checkout",
      filename: "checkoutEntry.js",
      remotes: {
        checkout: "checkout@http://localhost:8080/checkoutEntry.js",
        search: "search@http://localhost:8080/searchEntry.js",
        home: "home@http://localhost:8080/homeEntry.js",
      },
      exposes: {
        "./Checkout": "./src/CheckoutContent",
        "./AddToCart": "./src/AddToCart",
        "./checkout": "./src/checkout",
        "./store": "./src/store",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new DashboardPlugin({
      dashboardURL: "http://localhost:3000/api/update",
      metadata: {
        source: {
          url: "http://github.com",
        },
        remote: "http://localhost:8081/remoteEntry.js",
      },
    }),
    // new HtmlWebPackPlugin({
    //   template: "./src/index.html",
    // }),
  ],
};
