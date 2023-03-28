import BaseDateTime from './base-date-time.js';
import { _dateFromArray } from './utils.js';
import { _arrayRemove } from '@d1g1tal/chrysalis';
import { DateParsingToken, dateParserTokenMappings, regExps, invalidDate } from './constants.js';

export default class DateParser {
	#dateParsingPatterns;
	#customParsingPatterns;

	/**
	 *
	 * @param {string} localeDatePattern
	 * @param {string} localeTimePattern
	 */
	constructor(localeDatePattern, localeTimePattern) {
		/** @type {Array<RegExp>} */
		this.#dateParsingPatterns = [ regExps.isoParsingPattern, _fromLocalePatterns(localeDatePattern, localeTimePattern) ];
		/** @type {Map<string, RegExp>} */
		this.#customParsingPatterns = new Map();
	}

	/**
	 * Parse a string representation of a date and return a {@link Date} object.
	 * The string is parsed using a {@link DateParserPattern} parameter or one from the pre-defined array
	 *
	 * @param {string} date
	 * @param {Object} options
	 * @param {boolean} [options.utc]
	 * @param {string} [options.pattern]
	 * @returns {BaseDateTime}
	 */
	parse(date, { utc = false, pattern }) {
		let parsedDate, dateTokens;

		if (pattern) {
			let dateParsingPattern = this.#customParsingPatterns.get(pattern);
			if (!dateParsingPattern) {
				dateParsingPattern = new RegExp(`^${_appendRegExp(_createPatternTokens(pattern))}$`);
				this.#customParsingPatterns.set(pattern, dateParsingPattern);
			}

			dateTokens = date.match(dateParsingPattern);
		} else {
			for (let i = 0, length = this.#dateParsingPatterns.length; i < length; i++) {
				if ((dateTokens = date.match(this.#dateParsingPatterns[i]))) break;
			}
		}

		if (dateTokens) {
			let { year, month, day, hour, minute, second, millisecond, zoneOffset, meridiem } = dateTokens.groups;
			millisecond = +(millisecond?.substring(0, 3)) || 0;

			if (zoneOffset !== undefined) {
				utc = true;
				if (zoneOffset !== '0') {
					// Add the offset to the milliseconds
					millisecond += 0 - (zoneOffset == 'Z' ? 0 : _parseZoneOffset(zoneOffset)) * 6e4;
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
}

/**
 *
 * @param {string} datePattern - The locale date pattern
 * @param {string} timePattern - The locale time pattern
 * @returns {RegExp}
 */
const _fromLocalePatterns = (datePattern, timePattern) => {
	const tokenTransformers = {};
	const timeTokens = _createPatternTokens(timePattern);
	const secondsDelimiterIndex = timeTokens.lastIndexOf(DateParsingToken.SECOND) - 1;

	if (!(timeTokens[secondsDelimiterIndex] in dateParserTokenMappings)) {
		const spaceTokenIndex = timeTokens.lastIndexOf(DateParsingToken.MERIDIEM) - 1;
		if (timeTokens[spaceTokenIndex] == ' ') {
			_arrayRemove(timeTokens, spaceTokenIndex);
		}

		const timeDelimiter = timeTokens[secondsDelimiterIndex];
		tokenTransformers[DateParsingToken.SECOND] = (regExpSource) => `(?:${timeDelimiter}${regExpSource})?`;
		tokenTransformers[DateParsingToken.MERIDIEM] = (regExpSource) => `(?:\\s${regExpSource})?`;

		_arrayRemove(timeTokens, secondsDelimiterIndex);
	}

	return new RegExp(`^${_appendRegExp(_createPatternTokens(datePattern))}(?:\\s${_appendRegExp(timeTokens, tokenTransformers)})?$`);
};

/**
 * Filter out anything other than a letter, digit or underscore or the element isn't already in the resulting array.
 *
 * @param {string} pattern
 * @returns {Array<string>} the unique pattern tokens
 */
const _createPatternTokens = (pattern) => Array.from(pattern).filter((elem, index, array) => regExps.nonWord.test(elem) || array.indexOf(elem) >= index);

/**
 *
 * @param {Array<string>} patternTokens
 * @param {Object} [tokenTransformers={}]
 * @returns {string}
 */
const _appendRegExp = (patternTokens, tokenTransformers = {}) => {
	let regExp = '';

	for (let i = 0, length = patternTokens.length, token, regExpSource; i < length; i++) {
		token = patternTokens[i];
		regExpSource = dateParserTokenMappings[token]?.source;
		regExp += tokenTransformers[token]?.(regExpSource) ?? regExpSource ?? token;
	}

	return regExp;
};

/**
 * Convert the time zone offset from hours to the number of minutes.
 *
 * @param {string} offset
 * @returns {number}
 */
const _parseZoneOffset = (offset = '') => {
	const [ hours = 0, minutes = 0 ] = offset.includes(':') ? offset.split(':').map(Number) : [ +offset / 100 ];
	return hours * 60 + minutes;
};