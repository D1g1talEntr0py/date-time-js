import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

export default (env) => {
	const config = {
		target: ['web', `es${env.esVersion}`],
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
			minimizer: [new TerserPlugin({ include: /\.min\.js$/, terserOptions: { ecma: env.esVersion } })]
		}
	};

	if (env.esVersion == 5) {
		config.module = {
			rules: [{	test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }]
		};
	}

	return config;
};