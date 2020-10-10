const path = require('path');

module.exports = {
	entry: {
		chat: './src/index.js'
	},
	output: {
		filename: 'chat.js',
		path: path.join(__dirname, '/dist'),
		publicPath: "/dist",
	},
	module: {
		rules: [{
			// Все файлы, которые заканчиваются на .js
			test: /\.js$/,
			loader: "babel-loader",
			// Где не нужно проверять файлы:
			exclude: '/node_modules/'
		}]
	},
	devServer: {
		overlay: true,
		proxy: {
			'/socket.io': {
				target: 'http://localhost:3000',
				ws: true,
			},
		},
	},
};