// @ts-nocheck
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { _merge } from './webpack.config.utils.js';

const configurations = new Map([
	['esm', {
		output: { enabledLibraryTypes: ['module'], library: { type: 'module' } },
		experiments: { futureDefaults: true, outputModule: true }
	}],
	['umd', {
		output: { globalObject: 'this', enabledLibraryTypes: ['umd2', 'global'], library: { type: 'umd2' } }
	}]
]);

/**
 *
 * @param {Object} configuration
 * @param {number} esVersion
 * @param {string} moduleType
 * @returns {Object}
 */
const _mergeConfiguration = (configuration, esVersion, moduleType) => {
	const commonConfig = {
		name: moduleType,
		target: ['web', `es${esVersion}`],
		entry: {
			'date-time': `./src/js/index/${moduleType}.js`,
			'date-time.min': `./src/js/index/${moduleType}.js`,
		},
		output: {
			path: path.resolve(process.cwd(), `dist/${moduleType}`),
			filename: '[name].js',
			clean: true,
			environment: {
				arrowFunction: esVersion >= 6, // ES6
				bigIntLiteral: esVersion >= 2020, // ES2020
				const: esVersion >= 6, // ES6
				destructuring: esVersion >= 6, // ES6
				dynamicImport: esVersion >= 2020, // ES2020
				forOf: esVersion >= 6, // ES6
				module: esVersion >= 6, // ES6
				optionalChaining: esVersion >= 2020, // ES2020
				templateLiteral: esVersion >= 6, // ES6
			}
		},
		module: {
			parser: { javascript: { importMeta: false } },
			rules: []
		},
		optimization: {},
		plugins: []
	};

	return _merge({}, commonConfig, configuration);
};

/**
 * @param {Object} env
 * @param {number} env.esVersion
 * @param {string} env.transpile
 */
export default ({ esVersion = 2022, transpile = 'true' }) => {
	const config = [];

	configurations.forEach((configuration, moduleType) => {
		// Main configuration
		const mergedConfig = _mergeConfiguration(configuration, esVersion, moduleType);

		// Plugins
		const minimizerOptions = { include: /\.min\.js$/, terserOptions: { ecma: esVersion } };
		const copyPluginPattern = { from: './src/js/locales', to: 'locales/[name][ext]', info: { minimized: true } };

		if (moduleType == 'esm') {
			minimizerOptions.terserOptions.module = true;
		} else {
			Object.assign(copyPluginPattern, { transform: { transformer: (content) => `((Locale) => {\n${content.toString().replace('export default', 'const localeOptions =')}\n\nLocale.add(localeOptions);\n\n})(Locale);` } });
		}

		if (transpile === 'true') {
			mergedConfig.module.rules.push({ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ });
		}

		mergedConfig.optimization.minimizer = [new TerserPlugin(minimizerOptions)];
		mergedConfig.plugins.push(new CopyPlugin({ patterns: [copyPluginPattern] }));

		config.push(mergedConfig);
	});

	return config;
};