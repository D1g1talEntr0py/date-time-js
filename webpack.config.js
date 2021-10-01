import path from 'path';

export default ({
	target: ['web', 'es5'],
	entry: './src/js/index.js',
	output: {
		path: path.resolve(process.cwd(), 'dist'),
		filename: 'date-time.min.js',
		library: 'DateTime',
		libraryExport: 'default'
	},
	module: {
		rules: [{	test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }]
	}
});