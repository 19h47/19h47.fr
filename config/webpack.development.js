/**
 *
 * @file webpack.development.js
 * @author Jérémy Levron <jeremylevron@19h47.fr> (http://19h47.fr)
 */

const merge  = require('webpack-merge');
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(
	common,
	{
		output: {
			filename: 'js/[name].js'
		},
		mode: 'development',
		devtool: 'source-map',
		watch: true,
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
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/[name].css'
			}),
		]
	},
);
