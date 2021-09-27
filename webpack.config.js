import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

export default ({
	target: ['web', 'es5'],
	entry: './src/js/index.js',
	output: {
		path: path.resolve(process.cwd(), 'dist'),
		filename: 'date-time.min.js',
		library: 'DateTime',
		libraryTarget: 'var',
		libraryExport: 'default'
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: { ecma: 5,	compress: { passes: 5 }, output: { comments: false, beautify: false } }
			})
		]
	},
	module: {
		rules: [{	test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }]
	}
});