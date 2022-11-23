import BaseDateTime from './base-date-time.js';
import { DateTimeUnit, DateOperation, MillisecondsIn, DateField } from './constants.js';
/** @typedef { import('./period.js').default } Period */

/**
 * Creates a date from an array of numeric values
 *
 * @param {Array<number>} values
 * @param {boolean} [utc=false]
 * @returns {Date}
 */
const _dateFromArray = ([ year, month = 1, day = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 ], utc = false) => {
	// Decrement the value for month because it is 0 based in the native JavaScript Date object.
	--month;

	const date = utc ? new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)) : new Date(year, month, day, hours, minutes, seconds, milliseconds);

	// ლ(ಠ益ಠლ) Handle dates with a year less than 100 where the native Date constructor erroneously prefixes '19' to the year.
	if (year < 100) _set(date, DateField.year, year, utc);

	return date;
};

/**
 * Converts a legacy date (a date where the time zone offset is not a multiple of 15) to or from UTC
 *
 * @param {BaseDateTime} baseDate
 * @param {number} timeZoneOffset
 * @param {boolean} [utc=false]
 * @returns {BaseDateTime}
 */
const _convertLegacyDate = ({ year, month, day, hour, minute, second, millisecond }, timeZoneOffset, utc = false) => new BaseDateTime(_dateFromArray([year, month, day, hour, minute, second, millisecond + timeZoneOffset * MillisecondsIn.MINUTES * (utc ? 1 : -1)], utc), utc);

/**
 * Sets the value of the specified date field in the Date object
 *
 * @param {Date} date
 * @param {string} field
 * @param {number} value
 * @param {boolean} [utc=false]
 * @returns {number}
 */
const _set = (date, field, value, utc = false) => date[`${utc ? 'setUTC' : 'set'}${field}`](value);

/**
 * Gets the value of the specified date field from the Date object
 *
 * @param {Date} date
 * @param {string} field
 * @param {boolean} [utc]
 * @returns {number}
 */
const _get = (date, field, utc) => date[`${utc ? 'getUTC' : 'get'}${field}`]();

/**
 * Creates a new {@link Date} object starting at the specified unit.
 * It is faster to create a new {@link Date} object than to modify the existing one.
 *
 * @param {BaseDateTime} baseDate
 * @param {string} unit
 * @returns {BaseDateTime}
 */
const _startOf = (baseDate, unit) => {
	let values;
	switch (unit) {
		case DateTimeUnit.YEAR: values = [baseDate.year];	break;
		case DateTimeUnit.MONTH: values = [baseDate.year, baseDate.month]; break;
		case DateTimeUnit.DAY: values = [baseDate.year, baseDate.month, baseDate.day]; break;
		case DateTimeUnit.HOUR: values = [baseDate.year, baseDate.month, baseDate.day, baseDate.hour]; break;
		case DateTimeUnit.MINUTE: values = [baseDate.year, baseDate.month, baseDate.day, baseDate.hour, baseDate.minute];	break;
		case DateTimeUnit.SECOND: values = [baseDate.year, baseDate.month, baseDate.day, baseDate.hour, baseDate.minute, baseDate.second]; break;
		default: return new BaseDateTime(new Date(''));
	}

	return new BaseDateTime(_dateFromArray(values, baseDate.utc), baseDate.utc);
};

/**
 *
 * @param {Date} date
 * @param {Array<Period>} periods
 * @param {string} operationType
 * @param {boolean} utc
 * @returns
 */
const _processDatePeriodOperations = (date, periods, operationType, utc) => {
	// Reverse the order of operations when adding so that the least significant digits are added first. Otherwise, the result is wrong.
	for (const { field, value } of (operationType == DateOperation.ADD ? periods.reverse() : periods)) {
		if (value !== 0) {
			_set(date, field, _get(date, field, utc) + (operationType == DateOperation.SUBTRACT ? value * -1 : value), utc);
		}
	}

	return new BaseDateTime(date, utc);
};

/**
 *
 * @param {string} string
 * @param {number} start
 * @param  {...string} chars
 * @returns {string}
 */
const _splice = (string, start, ...chars) => {
	const charArray = Array.from(string);
	charArray.splice(start, 0, ...chars);
	return charArray.join('');
};

/**
 *
 *
 * @param {Array<*>} array
 * @param {number} from
 * @param {number} [to]
 */
const _removeArrayEntryByIndex = (array, from, to) => {
	const rest = array.slice((to || from) + 1 || array.length);
	array.length = from < 0 ? array.length + from : from;
	array.push(...rest);
};

export { _dateFromArray, _convertLegacyDate, _set, _get, _startOf, _processDatePeriodOperations, _splice, _removeArrayEntryByIndex };