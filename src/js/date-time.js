import Locale from './locale.js';
import Period from './period.js';
import Duration from './duration.js';
import DateParser from './date-parser.js';
import DateParserPattern from './date-parser-pattern.js'
import { _nativeDate } from './utils.js';
import { Types, Type } from './types.js';
import { dateParsingPatterns, dateTimePatterns, dateTimeFields, dateTimeFieldValues, timezone, INVALID_DATE, regExps, dateTimePeriods } from './constants.js';

let currentLocale;

class DateTime {
	/**
	 * 
	 * @param {string|number|Date|DateTime} date 
	 * @param {Object} [config]
	 * @param {string} config.pattern
	 * @param {boolean} config.utc
	 */
	constructor(date, { pattern, utc = false } = {}) {
		switch(Type.of(date)) {
			case Types.DATE_TIME: case Types.DATE: {
				this._date = _nativeDate({ date: +date });
				break;
			}
			case Types.STRING: {
				this._date = pattern ? DateParser.fromPattern(date, pattern, utc) : new DateParser(date, dateParsingPatterns, utc);
				break;
			}
			case Types.NUMBER: {
				this._date = _nativeDate({ date, utc });
				break;
			}
			case Types.ARRAY: {
				--date[1];
				this._date = _nativeDate({ date, utc, type: Types.ARRAY });
				break;
			}
			case Types.BOOLEAN: {
				this._date = _nativeDate({ utc: utc = date });
				break;
			}
			case Types.UNDEFINED: case Types.NULL: {
				this._date = _nativeDate({ utc });
				break;
			}
			default: this._date = _nativeDate({ date: '' });
		}

		this._utc = utc;
		this._locale = currentLocale;
		this._valid = this._date.toString() !== INVALID_DATE;
	}

	static Locale = Locale;
	static Duration = Duration;
	static patterns = dateTimePatterns;
	static fields = dateTimeFields;
	static timezoneFormats = timezone.formats;
	static periods = dateTimePeriods;

	/**
	 * 
	 * @param {Locale} locale
	 * @param {boolean} setAsCurrent
	 */
	static setDefaultLocale(locale) {
		currentLocale = locale;
		Object.assign(DateTime.patterns, locale.patterns);
		dateParsingPatterns.push(locale.dateParsingPattern);

		const _epochDate = _nativeDate({ date: 0 });

		for (const timezoneFormat of Object.values(DateTime.timezoneFormats)) {
			timezone.name[timezoneFormat][_epochDate.getTimezoneOffset()] = _formatTimezone(_epochDate, timezoneFormat);
		}
	
		_epochDate.setMonth(5);
	
		for (const timezoneFormat of Object.values(DateTime.timezoneFormats)) {
			timezone.name[timezoneFormat][_epochDate.getTimezoneOffset()] = _formatTimezone(_epochDate, timezoneFormat);
		}
	}

	/**
	 * Creates a DateTime object in UTC mode
	 * 
	 * @memberOf DateTime
	 * @param {string|number|Date|DateTime} date
	 * @returns {DateTime}
	 */
	static utc(date, pattern) {
		return new DateTime(date, { pattern, utc: true });
	}

	/**
	 * Parses the provided date to a DateTime object or null if the date is invalid.
	 *
	 * @memberOf DateTime
	 * @param {string} date
	 * @param {string} pattern
	 * @returns {DateTime|null}
	 */
	static parse(date, pattern) {
		return new DateTime(date, { pattern });
	}

	/**
	 * Returns a valid date or null otherwise
	 * 
	 * @param {string|number|Date|DateTime} date 
	 * @param {Object} [config]
	 * @param {string} config.pattern
	 * @param {boolean} config.utc
	 */
	static orNull(date, { pattern, utc } = {}) {
		const dateTime = new DateTime(date, { pattern, utc });
		return dateTime.isValid() ? dateTime : null;
	}

	/**
	 * Formats the date according to the specified pattern
	 * 
	 * @memberOf DateTime.prototype
	 * @param {string} pattern 
	 * @returns {string}
	 */
	format(pattern = DateTime.patterns.DEFAULT) {
		return this.isValid() ? _format(this, pattern) : INVALID_DATE;
	}

	local() {
		if (!this._utc) {
			return this;
		}

		const dateTime = new DateTime(this, { utc: false });
		// Ignore JavaScript's offset for ancient dates and calculate the milliseconds from the difference between the current offset and the value from the locale string
		if (dateTime._date.getTimezoneOffset() % 60 !== 0) {
			dateTime._date.setMilliseconds(dateTime.getMilliseconds() - dateTime.getTimezoneOffset() * 6e4 - _convertOffsetToMilliseconds(dateTime._date));
		}

		return dateTime;
	}

	utc() {
		if (this._utc) {
			return this;
		}

		const dateTime = new DateTime(this, { utc: true });
		// Ignore JavaScript's offset for ancient dates and calculate the milliseconds from the difference between the current offset and the value from the locale string
		if (dateTime._date.getTimezoneOffset() % 60 !== 0) {
			dateTime._date.setUTCMilliseconds(dateTime.getMilliseconds() + this.getTimezoneOffset() * 6e4 + _convertOffsetToMilliseconds(dateTime._date));
		}

		return dateTime;
	}

	/**
	 * 
	 * @param {number|Duration} value 
	 * @param {Period|String} period 
	 */
	add(value, period) {
		return _performOperation(this, value, period);
	}

	/**
	 * 
	 * @param {number|Duration} value 
	 * @param {Object|String} period 
	 */
	subtract(value, period) {
		return _performOperation(this, value, period, true);
	}

	/**
	 * 
	 * @param {DateTime} dateTime 
	 * @returns {Duration}
	 */
	duration(dateTime) {
		return new Duration(this.utc(), dateTime.utc());
	}

	/**
	 * 
	 * @param {DateTime} dateTime 
	 * @param {Period} period 
	 * @returns {number}
	 */
	diff(dateTime, period) {
		const duration = new Duration(this.utc(), dateTime.utc());

		switch(period) {
			case DateTime.periods.YEARS: return duration.asYears();
			case DateTime.periods.MONTHS: return duration.asMonths();
			case DateTime.periods.WEEKS: return duration.asWeeks();
			case DateTime.periods.DAYS: return duration.asDays();
			case DateTime.periods.HOURS: return duration.asHours();
			case DateTime.periods.MINUTES: return duration.asMinutes();
			case DateTime.periods.SECONDS: return duration.asSeconds();
			case DateTime.periods.MILLISECONDS: return duration.asMilliseconds();
			default: return duration.asMilliseconds();
		}
	}

	/**
	 * 
	 * @param {string} field 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	set(field, value) {
		return _set(this, field, field == DateTime.fields.MONTH ? value - 1 : value, this._utc);
	}

	/**
	 * 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	setYear(value) {
		return _set(this, DateTime.fields.YEAR, value, this._utc);
	}

	/**
	 * 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	setMonth(value) {
		return _set(this, DateTime.fields.MONTH, value - 1, this._utc);
	}

	/**
	 * 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	setDay(value) {
		return _set(this, DateTime.fields.DAY, value, this._utc);
	}

	/**
	 * 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	setHours(value) {
		return _set(this, DateTime.fields.HOURS, value, this._utc);
	}

	/**
	 * 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	setMinutes(value) {
		return _set(this, DateTime.fields.MINUTES, value, this._utc);
	}

	/**
	 * 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	setSeconds(value) {
		return _set(this, DateTime.fields.SECONDS, value, this._utc);
	}

	/**
	 * 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	setMilliseconds(value) {
		return _set(this, DateTime.fields.MILLISECONDS, value, this._utc);
	}

	/**
	 * 
	 * @param {number} value 
	 * @returns {DateTime}
	 */
	setTimezoneOffset(value) {
		return _set(this, DateTime.fields.TIMEZONE_OFFSET, value, this._utc);
	}

	setLocale(locale) {
		DateTime.setDefaultLocale(this._locale = locale);
	}

	/**
	 * 
	 * @param {string} field 
	 * @returns {number}
	 */
	get(field) {
		return field == DateTime.fields.MONTH ? this.getMonth() : _get(this._date, field, this._utc);
	}

	/**
	 * 
	 * @returns {number}
	 */
	getYear() {
		return _get(this._date, DateTime.fields.YEAR, this._utc);
	}

	/**
	 * 
	 * @returns {number}
	 */
	getMonth() {
		return _get(this._date, DateTime.fields.MONTH, this._utc) + 1;
	}

	/**
	 * 
	 * @returns {number}
	 */
	getDay() {
		return _get(this._date, DateTime.fields.DAY, this._utc);
	}

	/**
	 * 
	 * @returns {number}
	 */
	getHours() {
		return _get(this._date, DateTime.fields.HOURS, this._utc);
	}

	/**
	 * 
	 * @returns {number}
	 */
	getMinutes() {
		return _get(this._date, DateTime.fields.MINUTES, this._utc);
	}

	/**
	 * 
	 * @returns {number}
	 */
	getSeconds() {
		return _get(this._date, DateTime.fields.SECONDS, this._utc);
	}

	/**
	 * 
	 * @returns {number}
	 */
	getMilliseconds() {
		return _get(this._date, DateTime.fields.MILLISECONDS, this._utc);
	}

	/**
	 * 
	 * @returns {number}
	 */
	getTimezoneOffset() {
		return this._utc ? 0 : Math.round(_get(this._date, DateTime.fields.TIMEZONE_OFFSET) / 60) * 60;
	}

	getLocale() {
		return this._locale;
	}

	getDaysInMonth() {
		const year = this.getYear();
		const month = this.getMonth();
		return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1);
	}

	getTimezone(format = DateTime.timezoneFormats.SHORT) {
		return this._valid ? timezone.name[format] : undefined;
	}

	/**
	 * Determines if the current date is valid
	 *
	 * @returns {boolean}
	 */
	isValid() {
		return this._valid;
	}

	isUtc() {
		return this._utc;
	}

	isDaylightSavingsTime() {
		return this.utc ? false : timezone.name[DateTime.timezoneFormats.SHORT][this.getTimezoneOffset()].slice(-2, -1) == 'D';
	}

	isLeapYear() {
		const year = this.getYear();
		return !(year & 3 || year & 15 && !(year % 25));
	}

	/**
	 * Convert DateTime to native Date
	 * 
	 * @returns {Date}
	 */
	toDate() {
		return _nativeDate({ date: +this._date });
	}

	/**
	 * Determines if one date is equal to the other.
	 *
	 * @memberOf DateTime
	 * @param {DateTime} dateTime
	 * @returns {boolean}
	 */
	equals(dateTime) {
		return +this._date === +dateTime._date;
	}

	/**
	 * Returns the primitive value of a DateTime object
	 *
	 * @memberOf DateTime
	 * @returns {number}
	 */
	valueOf() {
		return +this._date;
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 *
	 * @memberOf DateTime
	 * @returns {string}
	 */
	toString() {
		return this.format();
	}

	toLocaleString(options = {}) {
		return this._date.toLocaleString(this._locale.name, options);
	}

	toLocaleDateString(options = {}) {
		return this._date.toLocaleDateString(this._locale.name, options);
	}

	toLocaleTimeString(options = {}) {
		return this._date.toLocaleTimeString(this._locale.name, options);
	}

	get [Symbol.toStringTag]() {
    return DateTime.name;
  }
}

/**
 * 
 * @param {DateTime} dateTime
 * @param {string} field 
 * @param {number} value
 * @param {boolean} utc
 * @returns {DateTime}
 */
 const _set = (dateTime, field, value, utc) => {
	const _dateTime = new DateTime(dateTime, { utc });
	_dateTime._date[`${dateTime._utc ? 'setUTC' : 'set'}${field}`](value);

	return _dateTime;
};

/**
 * 
 * @param {Date} date
 * @param {string} field 
 * @param {boolean} [utc]
 * @returns {number}
 */
const _get = (date, field, utc = false) => date[`${utc ? 'getUTC' : 'get'}${field}`]();

/**
 *
 * @param {DateTime} dateTime
 * @param {string} pattern
 * @returns {string}
 */
const _format = (dateTime, pattern) => {
	const [ year, month, day, hours, minutes, seconds, milliseconds, offset, dayOfTheWeek ] = dateTimeFieldValues.map((field) => {
		switch(field) {
			case DateTime.fields.MONTH: return dateTime.get(field) - 1;
			case DateTime.fields.TIMEZONE_OFFSET: return dateTime.isUtc() ? 0 : dateTime.getTimezoneOffset();
			default: return dateTime.get(field);
		}
	});
	const	flags = {
		D: () => day,
		DD: () => `${day}`.padStart(2, '0'),
		d: () => dayOfTheWeek,
		dd: () => dateTime.getLocale().dayNames[dayOfTheWeek],
		ddd: () => dateTime.getLocale().dayNames[dayOfTheWeek + 7],
		M: () => month + 1,
		MM: () => `${(month + 1)}`.padStart(2, '0'),
		MMM: () => dateTime.getLocale().monthNames[month],
		MMMM: () => dateTime.getLocale().monthNames[month + 12],
		YYYY: () => `${year}`.padStart(4, 0),
		h: () => hours % 12 || 12,
		hh: () => `${(hours % 12 || 12)}`.padStart(2, '0'),
		H: () => hours,
		HH: () => `${hours}`.padStart(2, '0'),
		m: () => minutes,
		mm: () => `${minutes}`.padStart(2, '0'),
		s: () => seconds,
		ss: () => `${seconds}`.padStart(2, '0'),
		SSS: () => `${milliseconds}`.padStart(3, '0'),
		a: () => hours < 12 ? 'am' : 'pm',
		A: () => hours < 12 ? 'AM' : 'PM',
		z: () => dateTime.isUtc() ? 'UTC' : timezone.name[DateTime.timezoneFormats.SHORT][offset],
		zzz: () => `(${dateTime.isUtc() ? 'UTC' : timezone.name[DateTime.timezoneFormats.LONG][offset]})`,
		Z: () => dateTime.isUtc() ? 'Z' : _formatOffset(offset).splice(3, ':'),
		ZZ: () => _formatOffset(offset),
		Do: () => `${day}${['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10) * day % 10]}`
	};

	return pattern.replace(regExps.formattingTokens, ($0) => $0 in flags ? flags[$0]() : $0.slice(1, $0.length - 1));
};

const _formatOffset = (offset) => (offset > 0 ? '-' : '+') + `${(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60)}`.padStart(4, '0');

const _formatTimezone = (date, format) => {
	const localeDate = date.toLocaleDateString(currentLocale.name, { timeZoneName: format });
	return format == DateTime.timezoneFormats.LONG ? localeDate.slice(localeDate.indexOf(',') + 2) : localeDate.slice(-4).trim();
};

const _convertOffsetToMilliseconds = (date) => {
	const offset = _formatTimezone(date, DateTime.timezoneFormats.LONG);
	const [ sign, hours, minutes, seconds ] = offset.match(/^(?:GMT)([+-])(0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/).slice(1);

	return +(sign + new Duration({ hours, minutes, seconds }).asMilliseconds());
}

/**
 * 
 * @param {DateTime} dateTime 
 * @param {number|Object} value 
 * @param {Period|string} period 
 * @param {boolean} subtract 
 * @returns {DateTime}
 */
const _performOperation = (dateTime, value, period, subtract = false) => {
	/**
	 * 
	 * @param {DateTime} dateTime 
	 * @param {Period} period 
	 * @param {number} value
	 * @returns {DateTime}
	 */
	const _execute = (dateTime, period, value) => {
		if (period == DateTime.periods.WEEKS) {
			value *= 7;
		}
		return subtract ? period.subtract(dateTime, value) : period.add(dateTime, value);
	};

	if (Type.isObject(value)) {
		for (const [ periodName, periodValue ] of Object.entries(value)) {
			period = DateTime.periods[periodName.toUpperCase()];
			if (period) {
				dateTime = _execute(dateTime, period, periodValue);
			}
		}

		return dateTime;
	}

	if (Type.isString(period)) {
		period = DateTime.periods[period.toUpperCase()];
	}

	return period instanceof Period ? _execute(dateTime, period, value) : dateTime;
};

const _init = () => {
	dateParsingPatterns.push(new DateParserPattern(DateTime.patterns.ISO_DATE_TIME, /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][\d]|[3][01])[\sT]*(0\d|1\d|2[0-3])?:?([0-5]\d)?:?([0-5]\d)?[.:]?(\d{1,9})?([+-]\d\d:?\d\d|Z)?$/));

	DateTime.setDefaultLocale(new Locale({
		name: 'en-US',
		patterns: {
			LOCALE_DATE: 'MM/DD/YYYY',
			LOCALE_SHORT_DATE: 'M/D/YYYY',		
			LOCALE_DATE_TIME: 'MM/DD/YYYY hh:mm:ss A',
			LOCALE_SHORT_DATE_TIME: 'M/D/YYYY h:m:s A'
		},
		parsingRegExp: /^(0[1-9]|1[0-2])[/]?(0[1-9]|[12]\d|3[01])[/]?(\d{4})[\s]*(0?[1-9]|1[0-2])?:?(0?[1-9]|[1-5]\d)?:?(0?[1-9]|[1-5]\d)?[\s]*([A|P]M)?$/i,
		dayNames: [
			'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
		],
		monthNames: [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
			'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
		]
	}));
}

_init();

export default DateTime;