const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
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
  ],
  devServer: {
    port: 4444,
  }
}