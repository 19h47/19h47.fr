/**
 *
 * @file webpack.production.js
 * @author Jérémy Levron <jeremylevron@19h47.fr> (http://19h47.fr)
 */

const merge  = require('webpack-merge');
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(
	common,
	{
		output: {
			filename: 'js/[name].[chunkhash:8].js'
		},
		mode: 'production',
		devtool: false,
		watch: false,
		module: {
			rules: [{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../'
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: false
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false
						}
					}
				]
			}],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/[name].[chunkhash:8].css'
			}),
		]
	},
);
