/* eslint-disable @typescript-eslint/explicit-function-return-type */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require('node:fs')
const path = require('node:path')
const TerserPlugin = require('terser-webpack-plugin')

const tsConfig = require('./tsconfig.json')

const isDev = process.argv.includes('serve')
const tsConfigPaths = Object.entries(tsConfig.compilerOptions.paths)

/* ================================================================================================================== */

class PublicCopyPlugin {
  recursiveCopy(sourceDir, destDir) {
    for (const file of fs.readdirSync(sourceDir)) {
      const sourceFilePath = path.resolve(sourceDir, file)
      const destFilePath = path.resolve(destDir, file)

      if (fs.statSync(sourceFilePath).isDirectory()) {
        if (!fs.existsSync(destFilePath)) {
          fs.mkdirSync(destFilePath)
        }
        this.recursiveCopy(sourceFilePath, destFilePath)
      } else {
        if (file !== 'index.html') {
          fs.copyFileSync(sourceFilePath, destFilePath)
        }
      }
    }
  }

  /** @type import('webpack').WebpackPluginInstance['apply'] */
  apply(compiler) {
    compiler.hooks.afterEmit.tap('PublicCopyPlugin', () => {
      const publicPath = path.resolve(__dirname, 'public')
      const outputPath = compiler.outputPath

      if (fs.existsSync(publicPath) && fs.existsSync(outputPath)) {
        this.recursiveCopy(publicPath, outputPath)
      }
    })
  }
}

/* ================================================================================================================== */

/** @type import('webpack').Configuration */
module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src/index.tsx'),
  devtool: 'source-map',
  devServer: {
    port: 1420,
    hot: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      ...tsConfigPaths.reduce((prev, [keyRaw, pathsRaw]) => {
        const alias = keyRaw.replace('/*', '')
        const pathAlias = path.resolve(__dirname, pathsRaw[0].replace('/*', ''))

        return { ...prev, [alias]: pathAlias }
      }, {})
    }
  },
  module: {
    rules: [
      {
        test: /\.([t|j]sx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(s[c|a]ss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader'
      }
    ]
  },
  optimization: {
    minimize: !isDev,
    minimizer: isDev ? [] : [new TerserPlugin(), new CssMinimizerPlugin()]
  },
  plugins: [
    new PublicCopyPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.html',
      template: path.resolve(__dirname, 'public', 'index.html')
    }),
    new MiniCssExtractPlugin({ filename: 'css/[name].css', chunkFilename: 'css/[name].chunk.css' })
  ]
}
