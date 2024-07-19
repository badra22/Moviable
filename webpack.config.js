// const path = require("path");

// module.exports = {
//     entry: "./dist/index.js",
//     output: {
//         filename: "moviable.js",
//         path: path.resolve(__dirname, "dist")
//     }
// }

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Function to generate HtmlWebpackPlugin instances for each HTML file
const generateHtmlPlugins = (templateDir) => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.filter(item => path.extname(item) === '.html').map(item => {
    return new HtmlWebpackPlugin({
      filename: item,
      template: path.resolve(__dirname, `${templateDir}/${item}`),
      inject: 'body',
    });
  });
};

const htmlPlugins = generateHtmlPlugins('./');

module.exports = {
  entry: './dist/index.js', // Change this to your source entry file
  output: {
    filename: 'moviable.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    ...htmlPlugins
  ],
  devtool: 'source-map', // Optional: Useful for debugging
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};