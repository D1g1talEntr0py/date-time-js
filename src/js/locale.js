import DateParser from './date-parser.js';
import DateFormatter from './date-formatter.js';
import PatternFormat from './pattern-format.js';
import { i18n } from './constants.js';

/**
 *
 *
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class Locale {
	#name;
	#timeZoneFormatters;
	#patterns;
	#ordinal;
	#dateParser;
	#dayNames;
	#monthNames;

	/**
	 * Create a new {@link Locale} instance.
	 *
	 * @param {Object} localeOptions
	 * @param {string} localeOptions.name
	 * @param {Object} localeOptions.patternTokens
	 * @param {function(number): number} [localeOptions.ordinal=(day) => day]
	 * @param {Array<string>} localeOptions.dayNames
	 * @param {Array<string>} localeOptions.monthNames
	 * @param {boolean} [global]
	 */
	constructor({ name, patternTokens, ordinal = (day) => day, dayNames, monthNames }, global = false) {
		this.#name = name;
		this.#timeZoneFormatters = {
			[i18n.timeZoneFormats.SHORT]: Intl.DateTimeFormat(name, { timeZoneName: i18n.timeZoneFormats.SHORT }),
			[i18n.timeZoneFormats.LONG]: Intl.DateTimeFormat(name, { timeZoneName: i18n.timeZoneFormats.LONG })
		};
		this.#patterns = (name == i18n.locale) && DateFormatter.Pattern ? DateFormatter.Pattern : DateFormatter.createPatterns(patternTokens, global);
		this.#ordinal = ordinal;
		this.#dateParser = new DateParser(this.#patterns.DATE, this.#patterns.TIME_WITH_SECONDS);
		this.#dayNames = dayNames;
		this.#monthNames = monthNames;
		Object.freeze(this);
	}

	/**
	 *
	 * @param {string} localeName
	 * @param {boolean} [global]
	 * @returns {Promise<Object>}
	 */
	static async import(localeName, global = false) {
		const { default: localeOptions } = await import(/* webpackIgnore: true */ `./locales/${localeName}.js`);

		Locale.add(localeOptions, global);

		return localeOptions;
	}

	/**
	 * Adds a new {@link Locale} to the list of available Locales. If one already exists with the specified name, it will be replaced.
	 *
	 * @param {Object} localeOptions
	 * @param {boolean} [global]
	 */
	static add(localeOptions, global = false) {
		if (global) {
			const locale = new Locale(localeOptions, global);
			i18n.locales[localeOptions.name] = locale;
			i18n.locale = localeOptions.name;
			DateFormatter.Pattern = locale.patterns;
		} else {
			i18n.localeOptions[localeOptions.name] = localeOptions;
		}
	}

	/**
	 *
	 * @param {string} localeName
	 * @returns {Locale}
	 */
	static get(localeName) {
		let locale = i18n.locales[localeName];
		const localeOptions = i18n.localeOptions[localeName];

		if (!locale && localeOptions) {
			locale = new Locale(localeOptions, localeName == i18n.locale);
			i18n.locales[localeName] = locale;
			delete i18n.localeOptions[localeName];
		}

		return locale;
	}

	/**
	 * Sets the global locale to be used for all new {@link DateTime} instances if it has been added to the list of locales.
	 *
	 * @param {string} localeName
	 * @returns {boolean} true if locale was successfully added or already imported. Otherwise, false.
	 */
	static set(localeName) {
		if (i18n.locale != localeName) {
			const locale = Locale.get(localeName);

			if (!locale) {
				return false;
			}

			i18n.locale = localeName;
			DateFormatter.Pattern = locale.patterns;
		}

		return true;
	}

	/**
	 * Get the default locale for the current location.
	 *
	 * @returns {string}
	 */
	static get defaultLocale() {
		return i18n.defaultLocale;
	}

	/**
	 * Gets the name of the current locale.
	 *
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}

	/**
	 *
	 * @returns {Object.<string, Intl.DateTimeFormat>}
	 */
	get timeZoneFormatters() {
		return this.#timeZoneFormatters;
	}

	/**
	 *
	 * @returns {PatternFormat}
	 */
	get patterns() {
		return this.#patterns;
	}

	/**
	 *
	 * @returns {Function}
	 */
	get ordinal() {
		return this.#ordinal;
	}

	/**
	 *
	 * @returns {DateParser}
	 */
	get dateParser() {
		return this.#dateParser;
	}

	/**
	 *
	 * @returns {Array<string>}
	 */
	get dayNames() {
		return this.#dayNames;
	}

	/**
	 *
	 * @returns {Array<string>}
	 */
	get monthNames() {
		return this.#monthNames;
	}

	/**
	 *
	 * @returns {string}
	 */
	get [Symbol.toStringTag]() {
		return 'Locale';
	}
}