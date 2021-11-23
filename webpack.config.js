import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

/**
 * @param {Object} env
 * @param {number} esVersion
 * @param {string} type
 */
export default ({ esVersion = 5, type = 'var' }) => {
	const config = {
		target: ['web', `es${esVersion}`],
		entry: {
			'date-time': './src/js/index.js',
			'date-time.min': './src/js/index.js'
		},
		output: {
			path: path.resolve(process.cwd(), 'dist'),
			filename: '[name].js',
			library: { name: 'DateTime', type: type, export: 'default' },
			clean: true
		},
		optimization: {
			minimizer: [new TerserPlugin({ include: /\.min\.js$/, terserOptions: { ecma: esVersion } })]
		}
	};

	if (esVersion == 5) {
		config.module = {
			rules: [{	test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }]
		};
	}

	return config;
};