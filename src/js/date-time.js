import './extensions.js';
import Locale from './locale.js';
import Duration from './duration.js';
import DateParser from './date-parser.js';
import { Types, Type } from './types.js';
import { dateTimePatterns, dateTimeFields, dateTimeUnits, dateTimeFieldValues, i18n, INVALID_DATE, regExps, dateTimePeriods, _dateFromArray, _set, _get, dateOperations, _isLeapYear, _isDaylightSavingsTime, unitsInMilliseconds, _formatTimeZone, _startOf } from './constants.js';

/**
	 * Native JavaScript Date wrapper. Main features include
	 *
	 * Parsing of ISO and Locale numerical dates.
	 * Formatting using custom patterns.
	 * Ability to calculate the difference between two dates.
	 * Ability to add and subtract date periods from an existing {@link DateTime} instance.
	 * Ability to create and convert dates either in UTC or local time zones.
	 * {@link DateTime} instances are immutable.
	 * @module DateTime
 */

class DateTime {
	/**
	 *
	 * @param {string|number|Date|Array<number>|null|undefined} [date]
	 * @param {Object} [config]
	 * @param {string} [config.pattern]
	 * @param {boolean} [config.utc]
	 * @param {string} [config.locale]
	 * @returns {DateTime}
	 */
	constructor(date, { pattern, utc = false, locale = i18n.defaultLocale } = {}) {
		/** @private */
		this._locale = new Locale({ name: locale, ...i18n.locales[locale] });

		Object.assign(dateTimePatterns, this._locale.patterns);

		switch(Type.of(date)) {
			case Types.DATE: {
				/** @private */
				this._date = new Date(+date);
				if (utc) {
					this._date.setTime(+this._date - _convertOffsetToMilliseconds(this._date, locale));
				}
				break;
			}
			case Types.STRING: {
				// Pass options by reference so `options.utc` can be updated
				const options = { utc: utc, pattern: pattern };
				/** @private */
				this._date = new DateParser(this._locale.dateParserPattern).parse(date, options);
				utc = options.utc;
				break;
			}
			case Types.NUMBER: {
				/** @private */
				this._date = new Date(date);
				if (utc) {
					this._date.setTime(date - _convertOffsetToMilliseconds(this._date, locale));
				}
				break;
			}
			case Types.ARRAY: {
				/** @private */
				this._date = _dateFromArray([...date], utc);
				break;
			}
			case Types.UNDEFINED: case Types.NULL: {
				/** @private */
				this._date = new Date();
				if (utc) {
					this._date.setTime(+this._date - _convertOffsetToMilliseconds(this._date, locale));
				}
				break;
			}
			default: this._date = new Date('');
		}

		/** @private */
		this._utc = utc;
		/** @private */
		this._valid = this._date.toString() !== INVALID_DATE;
	}

	/**
	 * Static access to create a {@link Locale} instance.
	 */
	static Locale = Locale;

	/**
	 * Static access to create a {@link Duration} instance.
	 */
	static Duration = Duration;

	/**
	 * Static access to date/time patterns used for formatting.
	 */
	static patterns = dateTimePatterns;

	/**
	 * Static access to date/time fields for getting/setting values.
	 */
	static fields = dateTimeFields;

	/**
	 * Static access to date/time units.
	 */
	static units = dateTimeUnits;

	/**
	 * Static access to date/time periods when calculating the difference between 2 dates.
	 */
	static periods = dateTimePeriods;

	/**
	 * Static access to time zone formats when retrieving time zone information.
	 */
	static timeZoneFormats = i18n.timeZoneFormats;

	/**
	 * Adds a new {@link Locale} to the list of available Locales. If one already exists with the specified name, it will be replaced.
	 *
	 * @param {Locale} locale
	 * @param {boolean} [setAsDefault]
	 */
	static addLocale(locale, setAsDefault = false) {
		const { name, ...rest } = locale;
		i18n.locales[name] = rest;
		if (setAsDefault) {
			i18n.defaultLocale = locale;
		}
	}

	/**
	 * Sets the default locale if it has been added to the list of locales.
	 *
	 * @param {string} locale
	 */
	static setDefaultLocale(locale) {
		if (i18n.locales[locale]) {
			i18n.defaultLocale = locale;
		}
	}

	/**
	 * Creates a {@link DateTime} object in UTC mode.
	 *
	 * @param {string|number|Date} [date]
	 * @param {string} [pattern]
	 * @returns {DateTime}
	 */
	static utc(date, pattern) {
		return new DateTime(date, { pattern, utc: true });
	}

	/**
	 * Parses the provided date to a DateTime object or null if the date is invalid.
	 *
	 * @param {string} date
	 * @param {string} pattern
	 * @returns {DateTime}
	 */
	static parse(date, pattern) {
		return new DateTime(date, { pattern });
	}

	/**
	 * Returns a valid date or null otherwise
	 *
	 * @param {string|number|Date} date
	 * @param {Object} [config]
	 * @param {string} config.pattern
	 * @param {boolean} config.utc
	 * @param {string} config.locale
	 * @returns {DateTime|null}
	 */
	static orNull(date, { pattern, utc, locale } = {}) {
		const dateTime = new DateTime(date, { pattern, utc, locale });
		return dateTime.isValid() ? dateTime : null;
	}

	/**
	 * Returns the minimum date from the specified dates.
	 *
	 * @param  {...DateTime} dates
	 * @returns {DateTime}
	 */
	static min(...dates) {
		return dates.reduce((a, b) => a < b ? a : b);
	}

	/**
	 * Returns the maximum date from the specified dates.
	 *
	 * @param  {...DateTime} dates
	 * @returns {DateTime}
	 */
	static max(...dates) {
		return dates.reduce((a, b) => a < b ? b : a);
	}

	/**
	 * Create a DateTime instance at the start of a unit of time.
	 *
	 * @param {string} unit
	 * @param {boolean} utc
	 * @returns {DateTime}
	 */
	static startOf(unit, utc = false) {
		const dateTime = new DateTime(null, { utc });

		_startOf(dateTime._date, unit, utc);

		return dateTime;
	}

	/**
	 * Create a new DateTime instance at the start of a unit of time.
	 *
	 * @param {string} unit
	 * @returns {DateTime}
	 */
	startOf(unit) {
		const dateTime = this.clone();

		_startOf(dateTime._date, unit, dateTime._utc);

		return dateTime;
	}

	/**
	 * Converts a UTC date to a local date in the current time zone.
	 *
	 * @returns {DateTime}
	 */
	local() {
		if (!this._utc) {
			return this;
		}

		const dateTime = new DateTime(this._date);
		dateTime._date.setTime(+dateTime._date + _convertOffsetToMilliseconds(dateTime._date, dateTime._locale));

		return dateTime;
	}

	/**
	 * Converts a local date to a UTC date.
	 *
	 * @returns {DateTime}
	 */
	utc() {
		return this._utc ? this : new DateTime(this._date, { utc: true });
	}

	/**
	 * Adds the value to the date for the specified date/time period.
	 *
	 * @param {number|Duration} value
	 * @param {Period|String} [period]
	 */
	add(value, period) {
		return _performOperation(this, value, period, dateOperations.ADD);
	}

	/**
	 * Subtracts the value from the date for the specified date/time period.
	 *
	 * @param {number|Duration} value
	 * @param {Object|String} [period]
	 */
	subtract(value, period) {
		return _performOperation(this, value, period, dateOperations.SUBTRACT);
	}

	/**
	 * Calculates the difference between dates as a Duration.
	 *
	 * @param {DateTime} dateTime
	 * @returns {Duration}
	 */
	duration(dateTime) {
		return Duration.between(this, dateTime);
	}

	/**
	 * Calculates the difference between two dates for the specified date/time period.
	 *
	 * @param {DateTime} dateTime
	 * @param {Period} [period]
	 * @returns {number}
	 */
	diff(dateTime, period) {
		const duration = Duration.between(this, dateTime);

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
	 * Sets the value for the specified field and returns a new DateTime instance.
	 *
	 * @param {string} field
	 * @param {number} value
	 * @returns {DateTime}
	 */
	set(field, value) {
		const dateTime = new DateTime(+this, { utc: this._utc });
		_set(dateTime._date, field, field == DateTime.fields.MONTH ? value - 1 : value, dateTime._utc);
		return dateTime;
	}

	/**
	 * Sets the year and returns a new DateTime instance.
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setYear(value) {
		return this.set(DateTime.fields.YEAR, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setMonth(value) {
		return this.set(DateTime.fields.MONTH, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setDay(value) {
		return this.set(DateTime.fields.DAY, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setHours(value) {
		return this.set(DateTime.fields.HOURS, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setMinutes(value) {
		return this.set(DateTime.fields.MINUTES, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setSeconds(value) {
		return this.set(DateTime.fields.SECONDS, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setMilliseconds(value) {
		return this.set(DateTime.fields.MILLISECONDS, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setTimezoneOffset(value) {
		return this.set(DateTime.fields.TIMEZONE_OFFSET, value);
	}

	setLocale(locale) {
		return new DateTime(this._date, { locale });
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
	getTimeZoneOffset() {
		return this._utc ? 0 : Math.round(this._date.getTimezoneOffset() / 60) * 60;
	}

	getLocale() {
		return this._locale;
	}

	getDaysInMonth() {
		const month = this.getMonth();
		const year = this.getYear();

		return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1);
	}

	getTimeZone(format = DateTime.timeZoneFormats.SHORT) {
		return this._valid ? this._locale.timeZone.name[format] : undefined;
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
		return this._utc ? false : _isDaylightSavingsTime(this._date);
	}

	isLeapYear() {
		return _isLeapYear(this.getYear());
	}

	/**
	 * Convert DateTime to native Date
	 *
	 * @returns {Date}
	 */
	toDate() {
		return new Date(+this._date);
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
	 * Duplicates the existing {@link DateTime} as a new instance.
	 *
	 * @returns {DateTime}
	 */
	clone() {
		const dateTime = new DateTime(+this._date, { locale: this._locale.name });
		dateTime._utc = this._utc;
		return dateTime;
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
	 * Formats the date according to the specified pattern
	 *
	 * @memberOf DateTime.prototype
	 * @param {string} pattern
	 * @returns {string}
	 */
	format(pattern = DateTime.patterns.DEFAULT) {
		return this.isValid() ? _format(this, pattern) : INVALID_DATE;
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 *
	 * @memberOf DateTime
	 * @returns {string}
	 */
	toString() {
		return this.format(DateTime.patterns.FULL_DATE_TIME);
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

Object.defineProperty(Type, 'isDateTime', { value: (object) => object instanceof DateTime });
Object.defineProperty(Types, 'DATE_TIME', { enumerable: true, value: DateTime.name });

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
			case DateTime.fields.TIMEZONE_OFFSET: return dateTime.isUtc() ? 0 : dateTime.getTimeZoneOffset();
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
		z: () => dateTime.isUtc() ? 'UTC' : dateTime.getLocale().timeZone.name[DateTime.timeZoneFormats.SHORT][offset],
		zzz: () => `(${dateTime.isUtc() ? 'UTC' : dateTime.getLocale().timeZone.name[DateTime.timeZoneFormats.LONG][offset]})`,
		Z: () => dateTime.isUtc() ? 'Z' : _formatOffset(offset).splice(3, ':'),
		ZZ: () => _formatOffset(offset),
		Do: () => `${day}${['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10) * day % 10]}`
	};

	return pattern.replace(regExps.formattingTokens, ($0) => $0 in flags ? flags[$0]() : $0.slice(1, $0.length - 1));
};

const _convertOffsetToMilliseconds = (date, locale) => {
	let convertedOffset;
	if (date.getTimezoneOffset() % 60 === 0) {
		convertedOffset = date.getTimezoneOffset() * unitsInMilliseconds.MINUTES;
	} else {
		const offset = _formatTimeZone(date, DateTime.timeZoneFormats.LONG, locale);
		const [ sign, hours, minutes, seconds ] = offset.match(regExps.timeZoneOffset).slice(1);
		convertedOffset = +(sign + new Duration({ hours, minutes, seconds }).asMilliseconds());
	}

	return Math.abs(convertedOffset);
};

/**
 * Converts numeric timezone offset in minutes to hours and formats it (i.e. 300 -> -0500)
 *
 * @param {number} offset
 * @returns {string}
 */
 const _formatOffset = (offset) => (offset > 0 ? '-' : '+') + `${(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60)}`.padStart(4, '0');

/**
 *
 * @param {DateTime} dateTime
 * @param {Duration|number} value
 * @param {Period|string} period
 * @param {boolean} subtract
 * @returns {DateTime}
 */
const _performOperation = (dateTime, value, period, operationType) => {
	if (Type.isDuration(value)) {
		dateTime = dateTime.clone();

		for (const period of (operationType == dateOperations.ADD ? value.periods().reverse() : value.periods())) {
			if (period.value > 0) {
				_set(dateTime._date, period.field, _get(dateTime._date, period.field, dateTime._utc) + (operationType == dateOperations.SUBTRACT ? period.value * -1 : period.value), dateTime._utc);
			}
		}

		return dateTime;
	}

	switch(Type.of(period)) {
		case Types.PERIOD: return period[operationType](dateTime, value);
		case Types.STRING: return DateTime.periods[period.toUpperCase()][operationType](dateTime, value);
		default: return dateTime;
	}
};

export default DateTime;