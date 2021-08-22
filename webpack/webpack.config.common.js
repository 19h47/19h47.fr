/**
 * Common
 *
 * @file webpack.config.common.js
 * @author Jérémy Levron <jeremylevron@19h47.fr> (https://19h47.fr)
 */

const webpack = require('webpack');

// Plugins
const CopyPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const ESLintPlugin = require('eslint-webpack-plugin');

const dotenv = require('dotenv');

const resolve = require('./webpack.utils');

dotenv.config({ path: resolve('.env') });

// Manifest plugin
const manifestPlugin = new WebpackManifestPlugin({
	publicPath: 'dist/',
});

module.exports = {
	entry: {
		main: resolve('src/index.js'),
		editor: resolve('src/editor.js'),
	},
	output: {
		path: resolve('/dist'),
		publicPath: process.env.PUBLIC_PATH,
	},
	externals: {
		jquery: 'jQuery',
		$: 'jQuery',
	},
	resolve: {
		alias: {
			'@': resolve('src'),

			// scripts
			scripts: resolve('src/scripts'),
			abstracts: resolve('src/scripts/abstracts'),
			common: resolve('src/scripts/common'),
			modules: resolve('src/scripts/modules'),
			pages: resolve('src/scripts/pages'),
			transitions: resolve('src/scripts/transitions'),
			factories: resolve('src/scripts/factories'),
			services: resolve('src/scripts/services'),
			utils: resolve('src/scripts/utils'),
			blocks: resolve('src/scripts/blocks'),
			polyfills: resolve('src/scripts/polyfills'),
			vendors: resolve('src/scripts/vendors'),
			views: resolve('src/scripts/views'),
			videos: resolve('src/videos'),

			// stylesheets
			stylesheets: resolve('src/stylesheets'),

			// img
			jpg: resolve('src/img/jpg'),
			png: resolve('src/img/png'),
			gif: resolve('src/img/gif'),
			svg: resolve('src/img/svg'),
			icons: resolve('src/icons'),
		},
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.(woff2?|eot|ttf|otf|woff|svg)?$/,
				exclude: [/img/, /icons/],
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[hash][ext][query]',
				},
			},
			{
				test: /\.svg$/,
				exclude: [/img/, /fonts/],
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							spriteFilename: 'icons.svg',
							extract: true,
						},
					},
					'svg-transform-loader',
					'svgo-loader',
				],
			},
			{
				test: /\.svg$/,
				exclude: [/fonts/, /icons/],
				type: 'asset/resource',
				generator: {
					filename: 'img/svg/[name][ext]',
				},
				use: 'svgo-loader',
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|ogv)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100000,
							name: '[name].[ext]',
							publicPath: resolve('src/videos'),
							outputPath: 'videos/',
						},
					},
				],
			},
			{
				test: /\.(gif)$/i,
				exclude: [/animations/],
				type: 'asset/resource',
				generator: {
					filename: 'img/gif/[name][ext]',
				},
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							gifsicle: {
								interlaced: false,
							},
						},
					},
				],
			},
			{
				test: /\.(png)$/i,
				exclude: [/animations/],
				type: 'asset/resource',
				generator: {
					filename: 'img/png/[name][ext]',
				},
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4,
							},
						},
					},
				],
			},
			{
				test: /\.(jpe?g)$/i,
				exclude: [/animations/],
				type: 'asset/resource',
				generator: {
					filename: 'img/jpg/[name][ext]',
				},
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: [65],
							},
						},
					},
				],
			},
		],
	},
	plugins: [
		manifestPlugin,
		new SpriteLoaderPlugin({ plainSprite: true }),
		new WebpackNotifierPlugin({
			title: 'Webpack',
			excludeWarnings: true,
			alwaysNotify: true,
		}),
		new webpack.DefinePlugin({
			'process.env': dotenv.parsed,
		}),
		new ESLintPlugin(),
		new CopyPlugin({
			patterns: [{ from: resolve('src/favicons'), to: 'favicons' }],
		}),
	],
};
