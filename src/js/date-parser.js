import DateParserPattern from './date-parser-pattern.js';
import { dateTimePatterns, datePatternTokens, dateTimeTokens, regExps, _dateFromArray } from './constants.js';

const isoParserPattern = new DateParserPattern(dateTimePatterns.ISO_DATE_TIME, regExps.isoParsingPattern);

export default class DateParser {
	/**
	 *
	 * @param {DateParserPattern} localeParserPattern
	 * @returns {DateParser}
	 */
	constructor(localeParserPattern) {
		this._dateParsingPatterns = [isoParserPattern, localeParserPattern];
	}

	/**
	 * Parse a string representation of a date and return a {@link Date} object.
	 * The string is parsed using a {@link DateParserPattern} parameter or one from the pre-defined array
	 *
	 * @param {string} date
	 * @param {Object} options
	 * @param {boolean} [options.utc]
	 * @param {string} [options.pattern]
	 * @returns {Date}
	 */
	parse(date, options = { utc: false, pattern: undefined }) {
		let dateTokens, patternTokens, zoneOffset, meridiem;
		let { pattern } = options;

		for (const { tokens, regExp } of (pattern ? [new DateParserPattern(pattern)] : this._dateParsingPatterns)) {
			dateTokens = date.match(regExp)?.slice(1);
			if (dateTokens) {
				patternTokens = tokens;
				break;
			}
		}

		if (!dateTokens) {
			return new Date('');
		}

		const values = [0, 0, 1, 0, 0, 0, 0, 0, 0];
		for (let i = 0, length = patternTokens.length, { index, unit } = {}, dateToken; i < length; i++) {
			dateToken = dateTokens[i];
			if (dateToken !== undefined) {
				({ index, unit } = datePatternTokens[patternTokens[i]]);
				switch(unit) {
					case dateTimeTokens.DAY: values[index] = +dateToken || 1; break;
					case dateTimeTokens.MILLISECOND: values[index] = +(dateToken)?.substring(0, 3);	break;
					case dateTimeTokens.ZONE_OFFSET: values[index] = zoneOffset = dateToken == 'Z' ? 0 : _parseZoneOffset(dateToken); break;
					case dateTimeTokens.MERIDIEM: values[index] = meridiem = dateToken; break;
					default: values[index] = +dateToken;
				}
			}
		}

		if (zoneOffset !== undefined) {
			options.utc = true;
			if (zoneOffset != 0) {
				// Add the offset to the milliseconds
				values[datePatternTokens.S.index] += -(zoneOffset) * 6e4;
			}
		} else if (meridiem !== undefined) {
			if (meridiem.toUpperCase() == 'PM') {
				// Update the hours to 24 hour format by adding 12
				values[datePatternTokens.H.index] += 12;
			} else if (values[datePatternTokens.H.index] == 12) {
				// Set the hours to 0 for 12am
				values[datePatternTokens.H.index] = 0;
			}
		}

		return _dateFromArray(values, options.utc);
	}
}

/**
 * Convert the time zone offset from hours to the number of minutes.
 *
 * @param {string} offset
 * @returns {number}
 */
 const _parseZoneOffset = (offset = '') => {
	const [ hours = 0, minutes = 0 ] = offset.includes(':') ? offset.split(':').map(Number) : [ +offset / 100, undefined ];
	return hours * 60 + minutes;
};