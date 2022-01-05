import DateParserPattern from './date-parser-pattern.js';
import { dateTimePatterns, dateTimeFieldValues, datePatternTokens, dateTimeUnits, regExps, _dateFromArray } from './constants.js';

const fieldValues = dateTimeFieldValues.slice(0, 7);
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
	 *
	 * @param {Date} date
	 * @param {boolean} [utc]
	 * @param {string} [pattern]
	 * @returns {Date}
	 */
	parse(date, utc = false, pattern) {
		let dateTokens, patternTokens, zoneOffset, meridiem;

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
					case dateTimeUnits.MONTH: values[index] = dateToken - 1; break;
					case dateTimeUnits.DAY: values[index] = +dateToken || 1; break;
					case dateTimeUnits.MILLISECONDS: values[index] = +(dateToken)?.substring(0, 3);	break;
					case dateTimeUnits.ZONE_OFFSET: values[index] = zoneOffset = dateToken == 'Z' ? 0 : _parseZoneOffset(dateToken); break;
					case dateTimeUnits.MERIDIEM: values[index] = meridiem = dateToken; break;
					default: values[index] = +dateToken;
				}
			}
		}

		if (zoneOffset !== undefined) {
			utc = true;
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

		let _date;
		if (values[datePatternTokens.Y.index] < 100) {
			_date = new Date(1970, 0, 1);

			for (let i = 0, length = fieldValues.length, value; i < length; i++) {
				value = values[i];
				_date[`${utc ? 'setUTC' : 'set'}${fieldValues[i]}`](value);
			}
		} else {
			_date = _dateFromArray(values, utc);
		}

		return _date;
	}
}

/**
 *
 * @param {string} offset
 * @returns {number}
 */
 const _parseZoneOffset = (offset = '') => {
	const [ hours = 0, minutes = 0 ] = offset.includes(':') ? offset.split(':').map(Number) : [ +offset / 100, undefined ];
	return hours * 60 + minutes;
};