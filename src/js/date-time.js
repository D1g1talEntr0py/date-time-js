import './extensions.js';
import Locale from './locale.js';
import Period from './period.js';
import Duration from './duration.js';
import { Types, Type } from './types.js';

const INVALID_DATE = 'Invalid Date';
const regExp = {
	nonAlpha: /[\WT]+/g,
	nonNumeric: /[^\dA-Z]|T/gi,
	matchOffset: /(?=[+-]\d\d:?\d\d)/,
	patternParsingTokens: /(YYYY|MM?|DD?|hh?|HH?|mm?|ss?|S{1,3}|Z|A)/g,
	formattingTokens: /\[([^\]]+)]|Y{1,4}|M{1,4}|Do|D{1,2}|d{1,3}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|z{1,3}|SSS/g
};

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
			case Types.DATE: {
				this._date = new Date(+date);
				break;
			}
			case Types.STRING: {
				this._date = _parse(date, pattern);
				break;
			}
			case Types.NUMBER: {
				this._date = new Date(date);
				break;
			}
			case Types.BOOLEAN: case Types.UNDEFINED: {
				this._date = new Date();
				break;
			}
			default: {
				this._date = date instanceof DateTime ? new Date(+date) : new Date('');			
			}
		}

		this._utc = utc;
		this._locale = currentLocale;
		this._valid = this._date.toString() !== INVALID_DATE;
	}

	static Locale = Locale;
	static Duration = Duration;

	static patterns = {
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
		LOCALE_SHORT_DATE: undefined,
		LOCALE_DATE: undefined,
		LOCALE_DATE_TIME: undefined
	};

	static fields = {
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

	static periods = {
		YEARS: new Period(DateTime.fields.YEAR),
		MONTHS: new Period(DateTime.fields.MONTH),
		WEEKS: new Period(DateTime.fields.DAY),
		DAYS: new Period(DateTime.fields.DAY),
		HOURS: new Period(DateTime.fields.HOURS),
		MINUTES: new Period(DateTime.fields.MINUTES),
		SECONDS: new Period(DateTime.fields.SECONDS),
		MILLISECONDS: new Period(DateTime.fields.MILLISECONDS)
	}

	static timezoneFormats = {
		SHORT: 'short',
		LONG: 'long'
	}

	/**
	 * 
	 * @param {Locale} locale
	 * @param {boolean} setAsCurrent
	 */
	static setDefaultLocale(locale) {
		currentLocale = locale;
		Object.assign(DateTime.patterns, locale.patterns);
		dateParsingFormats.locale.tokens = DateTime.patterns.LOCALE_DATE_TIME.replace(regExp.nonAlpha, '').split('').unique();
		dateParsingFormats.locale.regExp = locale.parsingRegExp;
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
		return this._utc ? new DateTime(this, { utc: false }) : this;
	}

	utc() {
		return this._utc ? this : new DateTime(this, { utc: true });
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
		this._locale = locale;
		DateTime.setDefaultLocale(locale);
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
		return this._utc ? 0 : _get(this._date, DateTime.fields.TIMEZONE_OFFSET);
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
		return this._valid ? _formatTimezone(this, format) : undefined;
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
		return this._date.toLocaleString(this._locale.name, { timeZoneName: DateTime.timezoneFormats.SHORT}).slice(-2, -1) == 'D';
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
		return this._utc ? new Date(+this._date - Math.abs(this.getTimezoneOffset() * 6e4)) : new Date(+this._date);
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
}

let currentLocale;
const dateTimeFieldValues = Object.values(DateTime.fields);
const dateParsingFormats = {
	iso: {
		tokens: DateTime.patterns.ISO_DATE_TIME.replace(regExp.nonAlpha, '').split('').unique(),
		regExp: /^(\d{4})-([0][1-9]|[1][0-2])-([0][1-9]|[1|2][0-9]|[3][0|1])[\sT]*(0\d|1\d|2[0-3])?:?([0-5]\d)?:?([0-5]\d)?[.:]?(\d{3})?([+-]\d\d:?\d\d|Z)?$/
	},
	locale: {
		tokens: undefined,
		regExp: undefined
	}
};

DateTime.setDefaultLocale(new Locale({
	name: 'en-US',
	patterns: {
		LOCALE_SHORT_DATE: 'M/D/YYYY',
		LOCALE_DATE: 'MM/DD/YYYY',
		LOCALE_DATE_TIME: 'MM/DD/YYYY hh:mm:ss A'
	},
	parsingRegExp: /^([0]?[1-9]|[1][0-2])[/]?([0]?[1-9]|[1|2][0-9]|[3][0|1])[/]?(\d{4})[\s]*(0?\d|1\d|2[0-3])?:?([0-5]?\d)?:?([0-5]?\d)?[\s]*([A|P]M)?$/i,
	dayNames: [
		'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
		'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
	],
	monthNames: [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
		'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
	]
}));

/**
 * 
 * @param {DateTime} dateTime
 * @param {string} field 
 * @param {number} value
 * @param {boolean} utc
 * @returns {DateTime}
 */
 const _set = (dateTime, field, value, utc) => {
	const dt = new DateTime(dateTime, { utc: utc });
	dt._date[`${dateTime._utc ? 'setUTC' : 'set'}${field}`](value);

	return dt;
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
 * @param {string} parsableDate 
 * @param {string} pattern
 * @returns {Object}
 */
const _parse = (parsableDate, pattern) => {
	let utc = false;
	const units = {};

	if (pattern) {
		let [ date, offset = '' ] = parsableDate.split(regExp.matchOffset);
		date = `${date.replace(regExp.nonNumeric, '')}${offset}`;
		const patternTokens = pattern.match(regExp.patternParsingTokens);

		for (let index = 0, cursor = 0, length = patternTokens.length, token, value; index < length; cursor += value.length, index++) {
			token = patternTokens[index];
			if (token.charAt(0) in dateTokenParsers) {
				value = index == length - 1 ? date.slice(cursor) : date.slice(cursor, cursor + token.length);
				const { unit, parser } = dateTokenParsers[token.charAt(0)];
				units[unit] = parser ? parser(value) : +value;
			}
		}
	} else {
		let dateTokens, patternTokens;
		for (const { tokens, regExp } of Object.values(dateParsingFormats)) {
			dateTokens = parsableDate.match(regExp)?.slice(1);
			if (dateTokens) {
				patternTokens = tokens;
				break;
			}
		}			

		if (!dateTokens) {
			return new Date('');
		}

		for (let index = 0, length = patternTokens.length, { unit, parser } = {}, token; index < length; index++) {
			token = dateTokens[index];
			if (token !== undefined) {
				({ unit, parser } = dateTokenParsers[patternTokens[index]]);
				units[unit] = parser ? parser(token) : +token;
			}
		}
	}

	if (units[dateTimeUnits.ZONE_OFFSET] !== undefined) {
		utc = true;
		if (units[dateTimeUnits.ZONE_OFFSET] != 0) {
			if (!units[dateTimeUnits.MILLISECONDS]) {
				units[dateTimeUnits.MILLISECONDS] = 0;
			}
			units[dateTimeUnits.MILLISECONDS] += units[dateTimeUnits.ZONE_OFFSET] * 6e4;
		}
	} else if (units[dateTimeUnits.POST_MERIDIEM] !== undefined) {
		if (units[dateTimeUnits.POST_MERIDIEM]) {
			units[dateTimeUnits.HOURS] += 12;
		} else if (units[dateTimeUnits.HOURS] == 12) {
			units[dateTimeUnits.HOURS] = 0;
		}
	}

	const dateProperties = [
		units[dateTimeUnits.YEAR], 
		units[dateTimeUnits.MONTH] || 0, 
		units[dateTimeUnits.DAY] || 1, 
		units[dateTimeUnits.HOURS] || 0, 
		units[dateTimeUnits.MINUTES] || 0, 
		units[dateTimeUnits.SECONDS] || 0, 
		units[dateTimeUnits.MILLISECONDS] || 0
	];

	return utc ? new Date(Date.UTC(...dateProperties)) : new Date(...dateProperties);
};

const dateTimeUnits = {
	YEAR: 'year',
	MONTH: 'month',
	DAY: 'day',
	HOURS: 'hours',
	MINUTES: 'minutes',
	SECONDS: 'seconds',
	MILLISECONDS: 'milliseconds',
	ZONE_OFFSET: 'zoneOffset',
	POST_MERIDIEM: 'postMeridiem'
};

const dateTokenParsers = {
	Y: { unit: dateTimeUnits.YEAR, parser: undefined },
	M: { unit: dateTimeUnits.MONTH, parser: (input) => input - 1 },
	D: { unit: dateTimeUnits.DAY, parser: undefined },
	H: { unit: dateTimeUnits.HOURS, parser: undefined },
	h: { unit: dateTimeUnits.HOURS, parser: undefined },
	m: { unit: dateTimeUnits.MINUTES, parser: undefined },
	s: { unit: dateTimeUnits.SECONDS, parser: undefined },
	S: { unit: dateTimeUnits.MILLISECONDS, parser: (input) => +(input ?? '0').substring(0, 3) },
	Z: { unit: dateTimeUnits.ZONE_OFFSET, parser: (input) => input == 'Z' ? 0 : _parseZoneOffset(input) },
	A: { unit: dateTimeUnits.POST_MERIDIEM, parser: (input) => input.toLowerCase() == 'pm' }
};

/**
 * 
 * @param {string} offset 
 * @returns {number}
 */
const _parseZoneOffset = (offset = '') => {
	const [ hours = 0, minutes = 0 ] = offset.includes(':') ? offset.split(':').map(Number) : [ +offset / 100, undefined ];
	return -Math.abs(hours * 60 + minutes);
};

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
		YY: () => `${year}`.slice(2),
		YYYY: () => year,
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
		z: () => _formatTimezone(dateTime, DateTime.timezoneFormats.SHORT),
		zzz: () => `(${_formatTimezone(dateTime, DateTime.timezoneFormats.LONG)})`,
		Z: () => dateTime.isUtc() ? 'Z' : _formatOffset(offset).splice(3, ':'),
		ZZ: () => _formatOffset(offset),
		Do: () => `${day}${['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10) * day % 10]}`
	};

	return pattern.replace(regExp.formattingTokens, ($0) => $0 in flags ? flags[$0]() : $0.slice(1, $0.length - 1));
};

const _formatOffset = (offset) => (offset > 0 ? '-' : '+') + `${(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60)}`.padStart(4, '0');

const _formatTimezone = (dateTime, format) => {
	const localeDate = dateTime.toLocaleDateString({ timeZone: dateTime.isUtc() ? 'UTC' : undefined, timeZoneName: format });
	return format == DateTime.timezoneFormats.LONG ? localeDate.slice(localeDate.indexOf(',') + 2) : localeDate.slice(-4).trim();
};

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

export default DateTime;