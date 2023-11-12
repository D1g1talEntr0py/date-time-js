import { _objectMerge } from '@d1g1tal/chrysalis';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { EsbuildPlugin } from 'esbuild-loader';

const ES_VERSION = {
	ES6: 6,
	ES2016: 2016,
	ES2017: 2017,
	ES2018: 2018,
	ES2019: 2019,
	ES2020: 2020,
	ES2021: 2021,
	ES2022: 2022,
	ES2023: 2023,
	lookup: (/** @type {number} */ version) => Object.keys(ES_VERSION).find((v) => ES_VERSION[v] == version)
};

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
 * Merge the configurations for ESM and UMD.
 *
 * @param {Object} configuration The configuration options
 * @param {number} esVersion Target script version
 * @param {string} moduleType The module type
 * @returns {Object} The resulting webpack configuration
 */
const _mergeConfiguration = (configuration, esVersion, moduleType) => {
	const commonConfig = {
		name: moduleType,
		target: ['web', `es${esVersion}`],
		entry: {
			'date-time': `./src/index/${moduleType}.js`,
			'date-time.min': `./src/index/${moduleType}.js`,
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(process.cwd(), `dist/${moduleType}`),
			filename: '[name].js',
			clean: true,
			environment: {
				arrowFunction: esVersion >= ES_VERSION.ES6,
				bigIntLiteral: esVersion >= ES_VERSION.ES2020,
				const: esVersion >= ES_VERSION.ES6,
				destructuring: esVersion >= ES_VERSION.ES6,
				dynamicImport: esVersion >= ES_VERSION.ES2020,
				forOf: esVersion >= ES_VERSION.ES6,
				module: esVersion >= ES_VERSION.ES6,
				optionalChaining: esVersion >= ES_VERSION.ES2020,
				templateLiteral: esVersion >= ES_VERSION.ES6,
			}
		},
		module: {
			parser: { javascript: { importMeta: false } },
			rules: []
		},
		optimization: { usedExports: true },
		plugins: []
	};

	return _objectMerge(commonConfig, configuration);
};

/**
 * The webpack config function.
 *
 * @param {Object} env Environment variables
 * @param {number} [env.esVersion=2022] The ES version to target
 * @returns {Array<Object>} An array of webpack configurations.
 */
export default ({ esVersion = 2022 }) => {
	const config = [];

	console.log(`Build target: ${ES_VERSION.lookup(esVersion)}`);

	configurations.forEach((configuration, moduleType) => {
		// Main configuration
		const mergedConfig = _mergeConfiguration(configuration, esVersion, moduleType);

		// Plugins
		const minimizerOptions = { include: /\.min\.js$/, target: `es${esVersion}`, format: 'esm' };
		const copyPluginPattern = { from: './src/locales', to: 'locales/[name][ext]', info: { minimized: true } };

		if (moduleType != 'esm') {
			Object.assign(copyPluginPattern, { transform: { transformer: (content) => `((Locale) => {\n${content.toString().replace('export default', 'const localeOptions =')}\n\nLocale.add(localeOptions);\n\n})(Locale);` } });
		}

		mergedConfig.module.rules.push({ test: /\.js$/, loader: 'esbuild-loader', options: { target: `es${esVersion}` } });
		mergedConfig.optimization.minimizer = [ new EsbuildPlugin(minimizerOptions) ];
		mergedConfig.plugins.push(new CopyPlugin({ patterns: [copyPluginPattern] }));

		config.push(mergedConfig);
	});

	return config;
};