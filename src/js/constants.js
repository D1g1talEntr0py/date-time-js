import Period from './period.js';
import { Type } from './types.js';

const INVALID_DATE = 'Invalid Date';

const regExps = {
	nonAlpha: /[\WT]+/g,
	nonNumeric: /[^\dA-Z]|T/gi,
	matchOffset: /(?=[+-]\d\d:?\d\d)/,
	timeZoneFormatShort: /[A-Z](?!.*[(])/g,
	timeZoneFormatLong: /\((?:[^)]+)\)/g,
	timeZoneOffset: /^(?:GMT)([+-])(0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
	formattingTokens: /\[([^\]]+)]|Y{1,4}|M{1,4}|Do|D{1,2}|d{1,3}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|z{1,3}|SSS/g,
	isoParsingPattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][\d]|[3][01])[\sT]*(0\d|1\d|2[0-3])?:?([0-5]\d)?:?([0-5]\d)?[.:]?(\d{1,9})?([+-]\d\d:?\d\d|Z)?$/
};

const dateTimePatterns = {
	DEFAULT: 'dd MMM Do YYYY HH:mm:ss z',
	MEDIUM_DATE: 'MMM D, YYYY',
	LONG_DATE: 'MMMM D, YYYY',
	FULL_DATE: 'ddd, MMMM D, YYYY',
	FULL_DATE_TIME: 'ddd, MMMM D, YYYY hh:mm:ss A zzz',
	SHORT_TIME: 'h:mm A',
	MEDIUM_TIME: 'h:mm:ss A',
	LONG_TIME: 'h:mm:ss A zzz',
	READABLE_TIME: 'h:mm A z',
	ISO_DATE: 'YYYY-MM-DD',
	ISO_TIME: 'HH:mm:ss.SSSZ',
	ISO_DATE_TIME: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
	LOCALE_DATE: undefined,
	LOCALE_SHORT_DATE: undefined,
	LOCALE_DATE_TIME: undefined,
	LOCALE_SHORT_DATE_TIME: undefined
};

const dateTimeFields = {
	YEAR: 'FullYear',
	MONTH: 'Month',
	DAY: 'Date',
	HOURS: 'Hours',
	MINUTES: 'Minutes',
	SECONDS: 'Seconds',
	MILLISECONDS: 'Milliseconds',
	TIMEZONE_OFFSET: 'TimezoneOffset',
	DAY_OF_THE_WEEK: 'Day'
};

const dateTimePeriods = {
	YEARS: new Period(dateTimeFields.YEAR),
	MONTHS: new Period(dateTimeFields.MONTH),
	WEEKS: new Period(dateTimeFields.DAY),
	DAYS: new Period(dateTimeFields.DAY),
	HOURS: new Period(dateTimeFields.HOURS),
	MINUTES: new Period(dateTimeFields.MINUTES),
	SECONDS: new Period(dateTimeFields.SECONDS),
	MILLISECONDS: new Period(dateTimeFields.MILLISECONDS)
}

const dateTimeFieldValues = Object.values(dateTimeFields);
const dateOperations = { ADD: 'add', SUBTRACT: 'subtract' };
const i18n = {
	defaultLocale: 'en-US',
	locales: {
		'en-US': {
			patterns: {
				LOCALE_DATE: 'MM/DD/YYYY',
				LOCALE_SHORT_DATE: 'M/D/YYYY',
				LOCALE_DATE_TIME: 'MM/DD/YYYY hh:mm:ss A',
				LOCALE_SHORT_DATE_TIME: 'M/D/YYYY h:m:s A'
			},
			parsingRegExp: /^(0[1-9]|1[0-2])[/]?(0[1-9]|[12]\d|3[01])[/]?(\d{4})[\s]*(0?[1-9]|1[0-2])?:?(0?[0-9]|[1-5]\d)?:?(0?[0-9]|[1-5]\d)?[\s]*([A|P]M)?$/i,
			dayNames: [
				'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
				'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
			],
			monthNames: [
				'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
				'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
			]
		}
	},
	timeZoneFormats: { SHORT: 'short',	LONG: 'long' }
};

const dateTimeUnits = {
	YEAR: 'year',
	MONTH: 'month',
	DAY: 'day',
	HOUR: 'hour',
	MINUTE: 'minute',
	SECOND: 'second',
	MILLISECOND: 'millisecond'
};

const dateTimeTokens = Object.assign({}, dateTimeUnits, { ZONE_OFFSET: 'zoneOffset', MERIDIEM: 'meridiem' });

const datePatternTokens = {
	Y: { index: 0, unit: dateTimeTokens.YEAR, regExp: /(\d{4})/ },
	M: { index: 1, unit: dateTimeTokens.MONTH, regExp: /(0?[1-9]|1[0-2])?/ },
	D: { index: 2, unit: dateTimeTokens.DAY, regExp: /(0?[1-9]|[12][\d]|3[01])?/ },
	H: { index: 3, unit: dateTimeTokens.HOUR, regExp: /([01]?[\d]|2[0-3])?/ },
	h: { index: 3, unit: dateTimeTokens.HOUR, regExp: /(0?[\d]|1[0-2])?/ },
	m: { index: 4, unit: dateTimeTokens.MINUTE, regExp: /(0?[\d]|[1-5]\d)?/ },
	s: { index: 5, unit: dateTimeTokens.SECOND, regExp: /(0?[\d]|[1-5]\d)?/ },
	S: { index: 6, unit: dateTimeTokens.MILLISECOND, regExp: /(\d{1,3})?/ },
	Z: { index: 7, unit: dateTimeTokens.ZONE_OFFSET, regExp: /([+-]\d\d:?\d\d|Z)?/ },
	A: { index: 7, unit: dateTimeTokens.MERIDIEM, regExp: /([A|P]M)?/ }
};

const unitsInMilliseconds = {
	YEARS: 3.1536e10,
	MONTHS: 2.592e9,
	DAYS: 8.64e7,
	HOURS: 3.6e6,
	MINUTES: 6e4,
	SECONDS: 1e3,
	MILLISECONDS: 1
};

/**
 *
 * @param {DateTime} d1
 * @param {DateTime} d2
 * @returns {number}
 */
const _descendingComparator = (d1, d2) => d2 - d1;

/**
 *
 * @param {Array<number>} values
 * @param {boolean} utc
 * @returns {Date}
 */
const _dateFromArray = (values, utc = false) => {
	// Decrement the value for month if it exists in the array because the month is 0 based in the native JavaScript Date object.
	if (0 < values[1] && 2 < values.length) {
		--values[1];
	}
	const date = utc ? new Date(Date.UTC(...values)) : new Date(...values);
	// ლ(ಠ益ಠლ) Handle dates with a year less than 100 where the native Date constructor erroneously prefixes '19' to the year.
	if (values[0] < 100) {
		_set(date, dateTimeFields.YEAR, values[0], utc);
	}

	return date;
};

/**
 *
 * @param {Date} date
 * @param {string} field
 * @param {number|Array<number>} value
 * @param {boolean} utc
 * @returns {number}
 */
 const _set = (date, field, value, utc) => date[`${utc ? 'setUTC' : 'set'}${field}`](...(Type.isArray(value) ? value : [value]));

/**
 *
 * @param {Date} date
 * @param {string} field
 * @param {boolean} [utc]
 * @returns {number}
 */
const _get = (date, field, utc = false) => date[`${utc ? 'getUTC' : 'get'}${field}`]();

const _isLeapYear = (year) => !(year & 3 || year & 15 && !(year % 25));

/**
 * https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset
 *
 * Let x be the expected number of milliseconds into the year of interest without factoring in daylight savings.
 * Let y be the number of milliseconds since the Epoch from the start of the year of the date of interest.
 * Let z be the number of milliseconds since the Epoch of the full date and time of interest
 * Let t be the subtraction of both x and y from z: z - y - x. This yields the offset due to DST.
 * If t is zero, then DST is not in effect. If t is not zero, then DST is in effect.
 *
 * @param {Date} date
 * @returns {boolean} `true` if the date is observing DST, `false` otherwise
 */
const _isDaylightSavingsTime = (date) => {
	var month = date.getMonth() | 0;
	// Time since the Epoch at the start of the year
	var _date = new Date(+date);
	_date.setMonth(0);
	_date.setDate(0);

	// The code below works based upon the facts of signed right shifts (This assumes that x is a positive integer)
	//  • (x) >> n: shifts n and fills in the n highest bits with 0s
	//  • (-x) >> n: shifts n and fills in the n highest bits with 1s
	return date - _date - (((((31 & - month >> 4) + (28 + _isLeapYear(date.getFullYear() | 0) & 1 - month >> 4) + (31 & 2 - month >> 4) + (30 & 3 - month >> 4) + (31 & 4 - month >> 4) + (30 & 5 - month >> 4) + (31 & 6 - month >> 4) + (31 & 7 - month >> 4) + (30 & 8 - month >> 4) + (31 & 9 - month >> 4) + (30 & 10 - month >> 4) + date.getDate() | 0) & 0xffff) * 24 * 60 + (date.getHours() & 0xff) * 60 + (date.getMinutes() & 0xff)) | 0) * 60 * 1e3 - (date.getSeconds() & 0xff) * 1e3 - date.getMilliseconds() !== 0;
};

/**
 * Gets the current timezone for the current locale and formats it
 *
 * @param {Date} date
 * @param {string} format
 * @param {string} locale
 * @returns {string}
 */
const _formatTimeZone = (date, format, locale) => {
	// Check to see if the JavaScript engine supports Intl.DateTimeFormat features
	const _dateTimeFormat = Intl.DateTimeFormat(locale, { timeZoneName: format });
	if (_dateTimeFormat.formatToParts) {
		return _dateTimeFormat.formatToParts(date).find(part => part.type == 'timeZoneName')?.value;
	} else {
		return date.toTimeString().match(format == i18n.timeZoneFormats.SHORT ? regExps.timeZoneFormatShort : regExps.timeZoneFormatLong).join('');
	}
};

const _startOf = (date, unit, utc) => {
	switch(unit) {
		case dateTimeUnits.YEAR: {
			_set(date, dateTimeFields.MONTH, [0, 1], utc);
			_set(date, dateTimeFields.HOURS, [0, 0, 0, 0], utc);
			break;
		}
		case dateTimeUnits.MONTH: {
			_set(date, dateTimeFields.DAY, 1, utc);
			_set(date, dateTimeFields.HOURS, [0, 0, 0, 0], utc);
			break;
		}
		case dateTimeUnits.DAY: {
			_set(date, dateTimeFields.HOURS, [0, 0, 0, 0], utc);
			break;
		}
		case dateTimeUnits.HOUR: {
			_set(date, dateTimeFields.MINUTES, [0, 0, 0], utc);
			break;
		}
		case dateTimeUnits.MINUTE: {
			_set(date, dateTimeFields.SECONDS, [0, 0], utc);
			break;
		}
		case dateTimeUnits.SECOND: {
			_set(date, dateTimeFields.MILLISECONDS, 0, utc);
			break;
		}
	}
};

export { INVALID_DATE, regExps, dateTimePatterns, dateTimeFields, dateTimeFieldValues, dateTimePeriods, dateOperations, i18n, dateTimeUnits, dateTimeTokens, datePatternTokens, unitsInMilliseconds, _descendingComparator, _dateFromArray, _set, _get, _isLeapYear, _isDaylightSavingsTime, _formatTimeZone, _startOf };