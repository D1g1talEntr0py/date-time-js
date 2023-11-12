import EvictingCache from '@d1g1tal/collections/evicting-cache.js';
import BaseDateTime from './base-date-time.js';
import { DateParsingToken, dateParserTokenMappings, invalidDate, regExps } from './constants.js';
import { _dateFromArray } from './utils.js';

/**
 * Class used to parse {@link string} representations of dates.
 *
 * @module DateParser date-parser
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
 */
export default class DateParser {
	/** @type {EvictingCache<string, RegExp>} */
	#parsingPatterns;
	/** @type {string} */
	#localeDatePattern;
	/** @type {string} */
	#localeTimePattern;
	/** @type {RegExp} */
	#localeDateRegExp;

	/**
	 * Create a new {@link DateParser} instance.
	 *
	 * @param {string} localeDatePattern The locale date pattern.
	 * @param {string} localeTimePattern The locale time pattern.
	 */
	constructor(localeDatePattern, localeTimePattern) {
		this.#parsingPatterns = new EvictingCache();
		this.#localeDatePattern = localeDatePattern;
		this.#localeTimePattern = localeTimePattern;
	}

	/**
	 * Parse a string representation of a date and return a {@link Date} object.
	 *
	 * @param {string} date The date to parse.
	 * @param {Object} options The options to use when parsing the date.
	 * @param {boolean} [options.utc=false] Indicates that the UTC flag should be used when retrieving a property.
	 * @param {string} [options.pattern] The pattern to use when parsing the date.
	 * @returns {BaseDateTime} The parsed date.
	 */
	parse(date, { utc = false, pattern }) {
		/** @type {Date} */
		let parsedDate;
		/** @type {Array<string>} */
		let dateTokens;

		if (pattern) {
			dateTokens = date.match(this.#parsingPatterns.getOrPut(pattern, () => new RegExp(`^${this.#appendRegExp(this.#createPatternTokens(pattern))}$`)));
		} else {
			dateTokens = date.match(regExps.isoParsingPattern) ?? date.match(this.#localeDateRegExp ??= this.#fromLocalePatterns(this.#localeDatePattern, this.#localeTimePattern));
		}

		if (dateTokens) {
			let { year, month, day, hour, minute, second, millisecond, zoneOffset, meridiem } = dateTokens.groups;
			millisecond = +(millisecond?.substring(0, 3)) || 0;

			if (zoneOffset !== undefined) {
				utc = true;
				if (zoneOffset != '0') {
					// Add the offset to the milliseconds
					millisecond += 0 - (zoneOffset == 'Z' ? 0 : this.#parseZoneOffset(zoneOffset)) * 6e4;
				}
			} else if (meridiem !== undefined) {
				hour = +hour;
				if (meridiem.toUpperCase() == 'PM' && hour < 12) {
					// Update the hours to 24 hour format by adding 12
					hour += 12;
				} else if (meridiem.toUpperCase() == 'AM' && hour == 12) {
					// Set the hours to 0 for 12am
					hour = 0;
				}
			}

			parsedDate = _dateFromArray([year, month, day, hour, minute, second, millisecond], utc);
		}

		return new BaseDateTime(parsedDate ?? invalidDate, utc);
	}

	/**
	 * Filter out anything other than a letter, digit or underscore or the element isn't already in the resulting array.
	 *
	 * @param {string} pattern The pattern to create tokens from.
	 * @returns {Array<string>} The unique pattern tokens.
	 */
	#createPatternTokens(pattern) {
		/** @type {Array<string>} */
		const result = [];
		/** @type {Set<string>} */
		const patternTokens = new Set();

		for (const token of pattern) {
			if (!patternTokens.has(token) || regExps.nonWord.test(token)) { patternTokens.add(result[result.length] = token) }
		}

		return result;
	}

	/**
	 * Create a regular expression from the locale date and time patterns.
	 * If the time pattern doesn't contain seconds, then the seconds delimiter is removed from the date pattern.
	 * If the time pattern doesn't contain meridiem, then the space between the time and meridiem is removed from the date pattern.
	 *
	 * @param {string} datePattern The locale date pattern.
	 * @param {string} timePattern The locale time pattern.
	 * @returns {RegExp} The regular expression.
	 */
	#fromLocalePatterns(datePattern, timePattern) {
		const tokenTransformers = Object.create(null);
		const timeTokens = this.#createPatternTokens(timePattern);
		const secondsDelimiterIndex = timeTokens.lastIndexOf(DateParsingToken.SECOND) - 1;

		if (!(timeTokens[secondsDelimiterIndex] in dateParserTokenMappings)) {
			const spaceTokenIndex = timeTokens.lastIndexOf(DateParsingToken.MERIDIEM) - 1;
			if (timeTokens[spaceTokenIndex] == ' ') {
				timeTokens.splice(spaceTokenIndex, 1);
			}

			const timeDelimiter = timeTokens[secondsDelimiterIndex];
			tokenTransformers[DateParsingToken.SECOND] = (regExpSource) => `(?:${timeDelimiter}${regExpSource})?`;
			tokenTransformers[DateParsingToken.MERIDIEM] = (regExpSource) => `(?:\\s${regExpSource})?`;

			timeTokens.splice(secondsDelimiterIndex, 1);
		}

		return new RegExp(`^${this.#appendRegExp(this.#createPatternTokens(datePattern))}(?:\\s${this.#appendRegExp(timeTokens, tokenTransformers)})?$`);
	}

	/**
	 * Append the regular expression source for each token in the pattern.
	 * If a token transformer is provided for a token, then the token transformer is used to transform the regular expression source.
	 * If the token doesn't have a regular expression source, then the token is used as the regular expression source.
	 * If the token is a non-word character, then the token is escaped.
	 * If the token is a word character, then the token is wrapped in a non-capturing group.
	 *
	 * @param {Array<string>} patternTokens The pattern tokens.
	 * @param {Object} [tokenTransformers={}] The token transformers.
	 * @returns {string} The appended regular expression.
	 */
	#appendRegExp(patternTokens, tokenTransformers = {}) {
		return patternTokens.map((token) => tokenTransformers[token]?.(dateParserTokenMappings[token]?.source) ?? dateParserTokenMappings[token]?.source ?? token).join('');
	}

	/**
	 * Convert the time zone offset from hours to the number of minutes.
	 *
	 * @param {string} offset The time zone offset.
	 * @returns {number} The number of minutes.
	 */
	#parseZoneOffset(offset = '') {
		const [ hours = 0, minutes = 0 ] = offset.includes(':') ? offset.split(':').map(Number) : [ +offset / 100 ];
		return hours * 60 + minutes;
	}
}