import { _type } from '@d1g1tal/chrysalis';
import BaseDateTime from './base-date-time.js';
import DateFormatter from './date-formatter.js';
import Duration from './duration.js';
import Locale from './locale.js';
import Period from './period.js';
import TimeZone from './time-zone.js';
import { DateField, DateOperation, DateTimeUnit, i18n, PeriodUnit } from './constants.js';
import { _convertLegacyDate, _dateFromArray, _processDatePeriodOperations, _set, _startOf } from './utils.js';

/**
 * @typedef {Object} DateTimeConfig
 * @property {boolean} [utc = false] Create the DateTime with the UTC offset.
 * @property {string} [locale = i18n.locale] The specific locale to use.
 * @property {string} [pattern] The pattern to use to parse the supplied date string.
 */

/**
 * Native JavaScript Date wrapper. Main features include
 * Parsing of ISO, Locale, and custom date formats.
 * Formatting using custom patterns.
 * Ability to calculate the difference between two dates.
 * Ability to add and subtract date periods from an existing {@link DateTime} instance.
 * Ability to create and convert dates either in UTC or local time zones.
 * {@link DateTime} instances are immutable.
 *
 * @example
 * const dateTime = new DateTime('28/10/2018 23:43:12', { utc: true, pattern: 'DD/MM/YYYY HH:mm:ss' })
 * console.log(dateTime.toString()) // 2018-10-28T23:43:12.000Z
 * @module DateTime
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class DateTime {
	/** @type {BaseDateTime} */
	#baseDateTime;
	/** @type {Locale} */
	#locale;
	/** @type {TimeZone} */
	#timeZone;

	/**
	 * Create new {@link DateTime} instance from various parameter data types
	 *
	 * @param {string|number|Date|Array<number>|BaseDateTime|DateTimeConfig|undefined} [date = Date.now()]
	 * @param {DateTimeConfig} [dateTimeConfig = {}]
	 */
	constructor(date = Date.now(), { utc = false, locale = i18n.locale, pattern } = {}) {
		switch (_type(date)) {
			case String: {
				this.#locale = Locale.get(locale);
				this.#baseDateTime = this.#locale.dateParser.parse(date, { utc, pattern });
				break;
			}
			case Date: case Number: {
				this.#baseDateTime = new BaseDateTime(new Date(date.valueOf()), utc);
				break;
			}
			case Array: {
				this.#baseDateTime = new BaseDateTime(_dateFromArray(date, utc), utc);
				break;
			}
			case Object: {
				// Swap date parameter with DateTimeConfig. Use the defaults from the 'config' parameter if not present in the 'date' parameter passed in.
				({ utc = utc, locale = locale } = date);
				this.#baseDateTime = new BaseDateTime(new Date(), utc);
				break;
			}
			case BaseDateTime: {
				this.#baseDateTime = date;
				break;
			}
			default: this.#baseDateTime = new BaseDateTime(new Date(''));
		}

		if (this.#baseDateTime.isValid) {
			this.#locale ??= Locale.get(locale);
			this.#timeZone = new TimeZone(this.#baseDateTime, this.#locale.timeZoneFormatters);
		}
	}

	/**
	 * Static access to date/time patterns used for formatting.
	 *
	 * @returns { import('./pattern-format.js').default }
	 */
	static get Pattern() {
		return DateFormatter.Pattern;
	}

	/** Static access to date/time units. */
	static Unit = DateTimeUnit;

	/** Static access to date/time periods when calculating the difference between 2 dates. */
	static Period = PeriodUnit;

	/** Static access to time zone formats when retrieving time zone information. */
	static TimeZoneFormat = i18n.timeZoneFormats;

	/**
	 * Creates a {@link DateTime} object in UTC mode.
	 *
	 * @param {(string|number|Date|Array<number>|undefined)} [date]
	 * @param {Object} [config]
	 * @param {string} [config.locale]
	 * @param {string} [config.pattern]
	 * @returns {DateTime}
	 */
	static utc(date, { locale, pattern } = {}) {
		return new DateTime(date, { utc: true, locale, pattern });
	}

	/**
	 * Parses the provided date to a DateTime object or null if the date is invalid.
	 *
	 * @param {string} date
	 * @param {string} pattern
	 * @param {Object} [config]
	 * @param {boolean} [config.utc]
	 * @param {string} [config.locale]
	 * @returns {DateTime}
	 */
	static parse(date, pattern, { utc, locale } = {}) {
		return new DateTime(date, { utc, locale, pattern });
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
	 * Create a {@link DateTime} instance at the start of a unit of time.
	 *
	 * @param {string} unit
	 * @param {boolean} utc
	 * @returns {DateTime}
	 */
	static startOf(unit, { utc, locale } = {}) {
		return new DateTime(_startOf(new BaseDateTime(new Date(), utc), unit), { locale });
	}

	/**
	 * Create a new {@link DateTime} instance at the start of a unit of time.
	 *
	 * @param {string} unit
	 * @returns {DateTime}
	 */
	startOf(unit) {
		return new DateTime(_startOf(this.#baseDateTime, unit), { locale: this.#locale.name });
	}

	/**
	 * Converts a UTC date to a local date in the current time zone.
	 *
	 * @returns {DateTime}
	 */
	local() {
		if (!this.#baseDateTime.utc) return this;

		return this.#baseDateTime.isLegacyDate ? new DateTime(_convertLegacyDate(this.#baseDateTime, this.#timeZone.offset)) : new DateTime(this.valueOf());
	}

	/**
	 * Converts a local date to a UTC date.
	 *
	 * @returns {DateTime}
	 */
	utc() {
		if (this.#baseDateTime.utc) return this;

		return this.#baseDateTime.isLegacyDate ? new DateTime(_convertLegacyDate(this.#baseDateTime, this.#timeZone.offset, true)) : new DateTime(this.valueOf(), { utc: true });
	}

	/**
	 * Adds the value to the date for the specified date/time period.
	 *
	 * @param {(number|Duration)} value
	 * @param {string} [period]
	 * @returns {DateTime}
	 */
	add(value, period) {
		return DateTime.#performOperation(this, period ? new Period(value, period) : value, DateOperation.ADD);
	}

	/**
	 * Subtracts the value from the date for the specified date/time period.
	 *
	 * @param {(number|Duration)} value
	 * @param {string} [period]
	 * @returns {DateTime}
	 */
	subtract(value, period) {
		return DateTime.#performOperation(this, period ? new Period(value, period) : value, DateOperation.SUBTRACT);
	}

	/**
	 * Calculates the difference between dates as a {@link Duration}.
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
	 * @param {string} [period]
	 * @returns {number}
	 */
	diff(dateTime, period) {
		switch (period) {
			case DateTime.Period.YEARS: return this.duration(dateTime).asYears();
			case DateTime.Period.MONTHS: return this.duration(dateTime).asMonths();
			case DateTime.Period.WEEKS: return this.duration(dateTime).asWeeks();
			case DateTime.Period.DAYS: return this.duration(dateTime).asDays();
			case DateTime.Period.HOURS: return this.duration(dateTime).asHours();
			case DateTime.Period.MINUTES: return this.duration(dateTime).asMinutes();
			case DateTime.Period.SECONDS: return this.duration(dateTime).asSeconds();
			default: return this.duration(dateTime).asMilliseconds();
		}
	}

	/**
	 * Sets the value for the specified unit and returns a new {@link DateTime} instance.
	 *
	 * @param {string} unit
	 * @param {number} value
	 * @returns {DateTime}
	 */
	set(unit, value) {
		const date = new Date(this.valueOf());
		_set(date, DateField[unit], unit == DateTime.Unit.MONTH ? value - 1 : value, this.#baseDateTime.utc);
		return new DateTime(new BaseDateTime(date, this.#baseDateTime.utc), { locale: this.#locale.name });
	}

	/**
	 * Sets the year and returns a new DateTime instance.
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setYear(value) {
		return this.set(DateTime.Unit.YEAR, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setMonth(value) {
		return this.set(DateTime.Unit.MONTH, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setDay(value) {
		return this.set(DateTime.Unit.DAY, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setHour(value) {
		return this.set(DateTime.Unit.HOUR, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setMinute(value) {
		return this.set(DateTime.Unit.MINUTE, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setSecond(value) {
		return this.set(DateTime.Unit.SECOND, value);
	}

	/**
	 *
	 * @param {number} value
	 * @returns {DateTime}
	 */
	setMillisecond(value) {
		return this.set(DateTime.Unit.MILLISECOND, value);
	}

	/**
	 * Sets the current {@link Locale} for this {@link DateTime} instance.
	 *
	 * @param {string} locale
	 * @returns {DateTime}
	 */
	// TODO - add global parameter??
	setLocale(locale) {
		return new DateTime(this.valueOf(), { locale });
	}

	/**
	 *
	 * @param {string} unit
	 * @returns {number}
	 */
	get(unit) {
		return this.#baseDateTime[unit];
	}

	/**
	 *
	 * @returns {number}
	 */
	getYear() {
		return this.#baseDateTime.year;
	}

	/**
	 *
	 * @returns {number}
	 */
	getMonth() {
		return this.#baseDateTime.month;
	}

	/**
	 *
	 * @returns {number}
	 */
	getDay() {
		return this.#baseDateTime.day;
	}

	/**
	 *
	 * @returns {number}
	 */
	getHour() {
		return this.#baseDateTime.hour;
	}

	/**
	 *
	 * @returns {number}
	 */
	getMinute() {
		return this.#baseDateTime.minute;
	}

	/**
	 *
	 * @returns {number}
	 */
	getSecond() {
		return this.#baseDateTime.second;
	}

	/**
	 *
	 * @returns {number}
	 */
	getMillisecond() {
		return this.#baseDateTime.millisecond;
	}

	/**
	 * Returns the current {@link Locale} for this {@link DateTime} instance.
	 *
	 * @returns {Locale}
	 */
	getLocale() {
		return this.#locale;
	}

	/**
	 * The current time zone
	 *
	 * @returns {string}
	 */
	getTimeZone() {
		return this.#timeZone.location;
	}

	/**
	 * The current time zone offset
	 *
	 * @returns {number}
	 */
	getTimeZoneOffset() {
		return this.#timeZone.offset;
	}

	/**
	 *
	 * @param {string} timeZoneFormat
	 * @returns {string}
	 */
	getTimeZoneName(timeZoneFormat) {
		return this.#timeZone.getName(timeZoneFormat);
	}

	/**
	 *
	 * @returns {number}
	 */
	getDaysInMonth() {
		return this.#baseDateTime.daysInMonth;
	}

	getDayOfTheWeek() {
		return this.#baseDateTime.dayOfTheWeek;
	}

	/**
	 *
	 * @returns {number}
	 */
	getDayOfYear() {
		return this.#baseDateTime.dayOfTheYear;
	}

	/**
	 * Determines if the current date is valid
	 *
	 * @returns {boolean}
	 */
	isValid() {
		return this.#baseDateTime.isValid;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	isUtc() {
		return this.#baseDateTime.utc;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	isDaylightSavingsTime() {
		return this.#baseDateTime.utc ? false : this.#baseDateTime.isDaylightSavingsTime;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	isLeapYear() {
		return !(this.#baseDateTime.year & 3 || this.#baseDateTime.year & 15 && !(this.#baseDateTime.year % 25));
	}

	/**
	 * Convert DateTime to native Date
	 *
	 * @returns {Date}
	 */
	toDate() {
		return new Date(this.valueOf());
	}

	/**
	 * Determines if one date is equal to the other.
	 *
	 * @param {DateTime} dateTime
	 * @returns {boolean}
	 */
	equals(dateTime) {
		return this.valueOf() === dateTime.valueOf();
	}

	/**
	 * Duplicates the existing {@link DateTime} as a new instance.
	 *
	 * @returns {DateTime}
	 */
	clone() {
		return new DateTime(this.valueOf(), { utc: this.#baseDateTime.utc, locale: this.#locale.name });
	}

	/**
	 * Returns the primitive value of a DateTime object
	 *
	 * @returns {number}
	 */
	valueOf() {
		return this.#baseDateTime.date.valueOf();
	}

	/**
	 * Formats the date according to the specified pattern
	 *
	 * @param {string} [pattern]
	 * @param {boolean} [utc]
	 * @returns {string}
	 */
	format(pattern = DateTime.Pattern.RFC_1123, utc = this.#baseDateTime.utc) {
		return DateFormatter.format(this, pattern, utc);
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 *
	 * @returns {string}
	 */
	toString() {
		return DateFormatter.format(this, this.#baseDateTime.utc ? DateTime.Pattern.ISO_DATE_TIME : DateTime.Pattern.DEFAULT, this.#baseDateTime.utc);
	}

	/**
	 *
	 * @param {boolean} [short]
	 * @returns {string}
	 */
	toLocaleString(short = false) {
		return DateFormatter.format(this, short ? this.#locale.patterns.ABBR_DATE_TIME : this.#locale.patterns.DATE_TIME, this.#baseDateTime.utc);
	}

	/**
	 *
	 * @param {boolean} [short]
	 * @returns {string}
	 */
	toLocaleDateString(short = false) {
		return DateFormatter.format(this, short ? this.#locale.patterns.ABBR_DATE : this.#locale.patterns.DATE, this.#baseDateTime.utc);
	}

	/**
	 *
	 * @param {boolean} [short]
	 * @returns {string}
	 */
	toLocaleTimeString(short = false) {
		return DateFormatter.format(this, short ? this.#locale.patterns.TIME : this.#locale.patterns.TIME_WITH_SECONDS, this.#baseDateTime.utc);
	}

	/**
	 *
	 * @returns {string}
	 */
	toUtcString() {
		return this.format(DateTime.Pattern.RFC_1123, true);
	}

	/**
	 *
	 * @returns {string}
	 */
	get [Symbol.toStringTag]() {
		return 'DateTime';
	}

	/**
	 * Perform an arithmetic operation on a {@link DateTime} instance using the provided value and operation type
	 *
	 * @param {DateTime} dateTime
	 * @param {(Duration|Period)} value
	 * @param {string} operationType
	 * @returns {DateTime}
	 */
	static #performOperation(dateTime, value, operationType) {
		switch (_type(value)) {
			case Duration: return new DateTime(_processDatePeriodOperations(new Date(dateTime.valueOf()), value.periods(), operationType, dateTime.#baseDateTime.utc), { locale: dateTime.#locale.name });
			case Period: return value[operationType](dateTime);
			default: return dateTime;
		}
	}
}