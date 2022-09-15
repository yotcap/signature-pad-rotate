// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const base = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'cheap-module-source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      // ts-loader 用于加载解析 ts 文件
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,	// 开启代码压缩
  },
};

let tempConfig;

if (process.env.NODE_ENV === 'development') {
  tempConfig = {
    ...base,
    entry: path.join(__dirname, 'example/index.tsx'),
    output: {
      path: path.join(__dirname, 'example/dist'),
      filename: 'bundle.js',
      library: 'SignaturePadRotate',
      libraryTarget: 'umd',
    },
    plugins: [
      // 自动注入编译打包好的代码至 html
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './example/index.html'),
        filename: 'index.html',
      }),
    ],
    devServer: {
      // port: 8008,		// example 的启动端口，选填
    },
  };
} else if (process.env.NODE_ENV === 'production') {
  tempConfig = {
    ...base,
    entry: './src/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'signpadrotate',
      library: 'umd'
    },
    // devtool: 'none',
    externals: {
      'react': 'react',
      'react-dom': 'react-dom'
    },
    plugins: [
      new CleanWebpackPlugin({
        protectWebpackAssets: false,
        cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
      }),	// 编译之前清空 /dist
    ],
  }
}

module.exports = tempConfig;
