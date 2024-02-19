const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack")
module.exports = (env) => {
  const mode = env.mode;
  console.log(mode)
  return ({
  mode: 'development',
  entry: resolve(__dirname, 'index.js'),
  output: {
    path: resolve(__dirname),
    filename: 'bundle.js',
  },
  module:{
    rules:[
      {
        test: "/\.js$/",
        use: [
          { 
           loader: 'babel-loader',
           options: {
            presets: ['env','react'],
            plugins: ['transform-decorators-legacy','transform-class-properties']
           }
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '/public/index.html'),
    }),
    new webpack.DefinePlugin({
      "process.env.mode": JSON.stringify(mode),
  })
  ],
  devServer: {
    port: 4444,
  },
  // resolve: {
  //   alias: {
  //     appConfig: resolve(__dirname, `/GlobalConfigs/${mode}.config.js`),
  //   }
  // }
})}