import { i18n } from './constants.js';
import DateFormatter from './date-formatter.js';
import DateParser from './date-parser.js';
import PatternFormat from './pattern-format.js';

/** @typedef {import('./date-time.js').default} DateTime */

/**
 * A model object to store locale specific information for parsing and formatting a {@link DateTime} object.
 *
 * @module {Locale} locale
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
 */
export default class Locale {
	/** @type {string} */
	#name;
	/** @type {Object<string, Intl.DateTimeFormat>} */
	#timeZoneFormatters;
	/** @type {PatternFormat} */
	#patterns;
	/** @type {function(number): number} */
	#ordinal;
	/** @type {DateParser} */
	#dateParser;
	/** @type {Array<string>} */
	#dayNames;
	/** @type {Array<string>} */
	#monthNames;

	/**
	 * Create a new {@link Locale} instance.
	 *
	 * @param {Object} localeOptions The locale options to use for this instance.
	 * @param {string} localeOptions.name The name of the locale.
	 * @param {Object<string, string>} localeOptions.patternTokens The tokens to use for formatting and parsing dates.
	 * @param {function(number): number} [localeOptions.ordinal=(day) => day] The function to use for formatting ordinals.
	 * @param {Array<string>} localeOptions.dayNames The names of the days of the week.
	 * @param {Array<string>} localeOptions.monthNames The names of the months of the year.
	 * @param {boolean} [global=false] Whether or not this locale should be set as the global locale.
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
	 * Import a locale from a file.
	 *
	 * @static
	 * @async
	 * @param {string} localeName The name of the locale to import.
	 * @param {boolean} [global=false] Whether or not this locale should be set as the global locale.
	 * @returns {Promise<Object>} The locale options that were imported.
	 */
	static async import(localeName, global = false) {
		const { default: localeOptions } = await import(/* webpackIgnore: true */ `./locales/${localeName}.js`);

		Locale.add(localeOptions, global);

		return localeOptions;
	}

	/**
	 * Adds a new {@link Locale} to the list of available Locales. If one already exists with the specified name, it will be replaced.
	 *
	 * @static
	 * @param {Object} localeOptions The locale options to use for this instance.
	 * @param {boolean} [global] Whether or not this locale should be set as the global locale.
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
	 * Gets a {@link Locale} by name.
	 * If the locale has not been added to the list of available locales, it will be imported.
	 * If the locale has not been imported, it will be added to the list of available locales.
	 *
	 * @static
	 * @param {string} localeName The name of the locale to get.
	 * @returns {Locale} The {@link Locale} instance with the specified name.
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
	 * @static
	 * @param {string} localeName The name of the locale to set.
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
	 * @returns {string} The name of the default locale.
	 */
	static get defaultLocale() {
		return i18n.defaultLocale;
	}

	/**
	 * Gets the name of the current locale.
	 *
	 * @returns {string} The name of the current locale.
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Gets the time zone formatters for this locale.
	 * The formatters are created using the {@link Intl.DateTimeFormat} constructor.
	 * The formatters are cached so that they can be reused.
	 *
	 * @returns {Object<string, Intl.DateTimeFormat>} The time zone formatters for this locale.
	 */
	get timeZoneFormatters() {
		return this.#timeZoneFormatters;
	}

	/**
	 * Gets the patterns for this locale.
	 * The patterns are created using the {@link DateFormatter.createPatterns} method.
	 * The patterns are cached so that they can be reused.
	 *
	 * @returns {PatternFormat} The patterns for this locale.
	 */
	get patterns() {
		return this.#patterns;
	}

	/**
	 * Gets the ordinal function for this locale.
	 * The ordinal function is used to get the ordinal suffix for a day of the month.
	 * The ordinal function is cached so that it can be reused.
	 * The ordinal function is optional and will default to the ordinal function for the default locale if it is not specified.
	 * The ordinal function is created using the {@link DateFormatter.createOrdinal} method.
	 * The ordinal function is cached so that it can be reused.
	 *
	 * @returns {function(number): number} The ordinal function for this locale.
	 */
	get ordinal() {
		return this.#ordinal;
	}

	/**
	 * Gets the date parser for this locale.
	 * The date parser is created using the {@link DateParser} constructor.
	 * The date parser is cached so that it can be reused.
	 * The date parser is optional and will default to the date parser for the default locale if it is not specified.
	 * The date parser is created using the {@link DateFormatter.createDateParser} method.
	 *
	 * @returns {DateParser} The date parser for this locale.
	 */
	get dateParser() {
		return this.#dateParser;
	}

	/**
	 * Gets the day names for this locale.
	 * The day names are optional and will default to the day names for the default locale if they are not specified.
	 * The day names are created using the {@link DateFormatter.createDayNames} method.
	 * The day names are cached so that they can be reused.
	 *
	 * @returns {Array<string>} The day names for this locale.
	 */
	get dayNames() {
		return this.#dayNames;
	}

	/**
	 * Gets the month names for this locale.
	 * The month names are optional and will default to the month names for the default locale if they are not specified.
	 * The month names are created using the {@link DateFormatter.createMonthNames} method.
	 * The month names are cached so that they can be reused.
	 *
	 * @returns {Array<string>} The month names for this locale.
	 */
	get monthNames() {
		return this.#monthNames;
	}

	/**
	 * Returns the name of this {@link Locale} instance.
	 *
	 * @returns {string} The name of this {@link Locale} instance.
	 */
	get [Symbol.toStringTag]() {
		return 'Locale';
	}
}