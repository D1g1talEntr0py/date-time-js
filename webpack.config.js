import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

export default ({
	target: ['web', 'es5'],
	entry: {
		'date-time': './src/js/index.js',
		'date-time.min': './src/js/index.js'
	},
	output: {
		path: path.resolve(process.cwd(), 'dist'),
		filename: '[name].js',
		library: 'DateTime',
		libraryExport: 'default',
		clean: true
	},
	optimization: {
		minimizer: [new TerserPlugin({ include: /\.min\.js$/, terserOptions: { ecma: 5 } })]
	},
	module: {
		rules: [{	test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }]
	}
});