const { resolve } = require('path')
const webpack = require('webpack')
const { readdirSync, existsSync, readFileSync } = require('fs')
const { load } = require('js-yaml')
const { dependencies } = require('./package.json')

const entries = readdirSync(resolve(__dirname, './packages'))
  .map((dir) => ({
    path: resolve(__dirname, './packages', dir, 'index.js'),
    configPath: resolve(__dirname, './packages', dir, 'manifest.yml'),
    name: dir,
    version: dependencies[dir],
  }))
  .filter((t) => existsSync(t.path))
  .map((t) => ({
    ...t,
    versions: load(readFileSync(t.configPath, 'utf8')).versions,
  }))

const config = entries.map((t) => ({
  stats: 'minimal',
  target: ['web', 'es5'],
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  entry: t.path,
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  externals: Object.keys(t.versions[t.version].dependencies || {}),
  output: {
    path: resolve(__dirname, './dist', t.name, t.version),
    filename: 'index.js',
    libraryTarget: 'amd',
  },
}))

module.exports = config
