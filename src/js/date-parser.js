import DateParserPattern from './date-parser-pattern.js';
import { dateTimeFieldValues, datePatternTokens, dateTimeUnits, epochDateMS } from './constants.js';

const fieldValues = dateTimeFieldValues.slice(0, 7);

export default class DateParser {
	constructor(date, dateParsingPatterns, utc = false) {
		let dateTokens, patternTokens, zoneOffset, meridiem;
		for (const { tokens, regExp } of Object.values(dateParsingPatterns)) {
			dateTokens = date.match(regExp)?.slice(1);
			if (dateTokens) {
				patternTokens = tokens;
				break;
			}
		}			

		if (!dateTokens) {
			return new Date('');
		}

		const values = Array(8).fill(0);
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
				values[datePatternTokens.S.index] += zoneOffset * 6e4;
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
			_date = utc ? new Date(0) : new Date(epochDateMS);

			for (let i = 0, length = values.length - 1, value; i < length; i++) {
				value = values[i];
				_date[`${utc ? 'setUTC' : 'set'}${fieldValues[i]}`](value);
			}
		} else {
			_date = utc ? new Date(Date.UTC(...values)) : new Date(...values);
		}

		return _date;
	}

	static fromPattern(date, pattern, utc) {
		return new DateParser(date, [new DateParserPattern(pattern)], utc);
	}
}

/**
 * 
 * @param {string} offset 
 * @returns {number}
 */
 const _parseZoneOffset = (offset = '') => {
	const [ hours = 0, minutes = 0 ] = offset.includes(':') ? offset.split(':').map(Number) : [ +offset / 100, undefined ];
	return -Math.abs(hours * 60 + minutes);
};