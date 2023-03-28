import BaseDateTime from './base-date-time.js';
import { DateTimeUnit, DateOperation, MillisecondsIn, DateField, invalidDate } from './constants.js';

/** @typedef { import('./period.js').default } Period */

/**
 * Creates a date from an array of numeric values.
 *
 * @param {Array<number>} values The array of numeric values.
 * @param {boolean} [utc=false] Indicates that the UTC flag should be used when retrieving a property.
 * @returns {Date} The date.
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
 * Converts a legacy date (a date where the time zone offset is not a multiple of 15) to or from UTC.
 * This is necessary because the native JavaScript Date object does not support time zone offsets that are not a multiple of 15.
 * This method is used to convert a legacy date to a UTC date and vice versa.
 * The time zone offset is used to determine the correct time zone offset for the converted date.
 * The time zone offset is the number of minutes that the time zone is offset from UTC.
 *
 * @param {BaseDateTime} baseDate The legacy date to convert.
 * @param {number} timeZoneOffset	The time zone offset in minutes.
 * @param {boolean} [utc=false] Indicates that the UTC flag should be used when retrieving a property.
 * @returns {BaseDateTime} The converted date.
 */
const _convertLegacyDate = ({ year, month, day, hour, minute, second, millisecond }, timeZoneOffset, utc = false) => new BaseDateTime(_dateFromArray([year, month, day, hour, minute, second, millisecond + timeZoneOffset * MillisecondsIn.MINUTES * (utc ? 1 : -1)], utc), utc);

/**
 * Sets the value of the specified date field in the Date object.
 * This method is used to set the value of a date field in the native JavaScript Date object.
 *
 * @param {Date} date The date to modify.
 * @param {string} field The field to modify.
 * @param {number} value The value to set.
 * @param {boolean} [utc=false] Indicates that the UTC flag should be used when retrieving a property.
 * @returns {number} The value that was set.
 */
const _set = (date, field, value, utc = false) => date[`${utc ? 'setUTC' : 'set'}${field}`](value);

/**
 * Gets the value of the specified date field from the Date object
 *
 * @param {Date} date The date to retrieve the value from.
 * @param {string} field The field to retrieve.
 * @param {boolean} [utc=false] Indicates that the UTC flag should be used when retrieving a property.
 * @returns {number} The value of the specified field.
 */
const _get = (date, field, utc = false) => date[`${utc ? 'getUTC' : 'get'}${field}`]();

/**
 * Creates a new {@link Date} object starting at the specified unit.
 * It is faster to create a new {@link Date} object than to modify the existing one.
 *
 * @param {BaseDateTime} baseDate The date to start from.
 * @param {string} unit	The unit to start at.
 * @returns {BaseDateTime} The new date.
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
		default: return new BaseDateTime(invalidDate);
	}

	return new BaseDateTime(_dateFromArray(values, baseDate.utc), baseDate.utc);
};

/**
 * Processes the date period operations.
 * This method is used to add or subtract periods from a date.
 * The periods are processed in the order they are specified.
 *
 * @param {Date} date The date to modify.
 * @param {Array<Period>} periods The periods to add or subtract.
 * @param {string} operationType The operation type.
 * @param {boolean} utc Indicates that the UTC flag should be used when retrieving a property.
 * @returns {BaseDateTime} The modified date.
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

export { _dateFromArray, _convertLegacyDate, _set, _get, _startOf, _processDatePeriodOperations };