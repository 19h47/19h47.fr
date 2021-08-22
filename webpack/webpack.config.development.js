/**
 *
 * @file webpack.config.development.js
 * @author Jérémy Levron <jeremylevron@19h47.fr> (https://19h47.fr)
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	watch: true,
	module: {
		rules: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../',
						},
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								sourceMap: true,
								precision: 10,
							},
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
		}),
	],
};
