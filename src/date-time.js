import { _type } from '@d1g1tal/chrysalis';
import BaseDateTime from './base-date-time.js';
import DateFormatter from './date-formatter.js';
import Duration from './duration.js';
import Locale from './locale.js';
import Period from './period.js';
import TimeZone from './time-zone.js';
import { DateField, DateOperation, DateTimeUnit, i18n, PeriodUnit, invalidDate } from './constants.js';
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
 * @module {DateTime} date-time
 * @author d1g1tal <jason.dimeo@gmail.com>
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
	 * @example const dateTime = new DateTime();
	 * @example const dateTime = new DateTime('28/10/2018 23:43:12', { utc: true, pattern: 'DD/MM/YYYY HH:mm:ss' });
	 * @example const dateTime = new DateTime(new Date(), { utc: true });
	 * @example const dateTime = new DateTime([2018, 10, 28, 23, 43, 12], { utc: true });
	 * @example const dateTime = new DateTime({ utc: true });
	 * @param {string|number|Date|Array<number>|BaseDateTime|DateTimeConfig|undefined} [date=Date.now()] The optional value used to create an instance of a new {@link DateTime} object
	 * @param {DateTimeConfig} [dateTimeConfig={}] The optional configuration object for the new {@link DateTime} instance
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
			default: this.#baseDateTime = new BaseDateTime(invalidDate);
		}

		if (this.#baseDateTime.isValid) {
			this.#locale ??= Locale.get(locale);
			this.#timeZone = new TimeZone(this.#baseDateTime, this.#locale.timeZoneFormatters);
		}
	}

	/**
	 * Static access to date/time patterns used for formatting.
	 *
	 * @returns { import('./pattern-format.js').default } The object used to hold the {@link DateTime} patterns for formatting.
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
	 * @param {(string|number|Date|Array<number>|undefined)} [date] The optional value used to create an instance of a new {@link DateTime} object
	 * @param {DateTimeConfig} [dateTimeConfig = {}] The optional configuration object for the new {@link DateTime} instance. The value for 'utc' is ignored.
	 * @returns {DateTime} The {@link DateTime} instance using UTC
	 */
	static utc(date, { locale, pattern } = {}) {
		return new DateTime(date, { utc: true, locale, pattern });
	}

	/**
	 * Parses the provided date to a {@link DateTime} object or null if the date is invalid.
	 *
	 * @param {string} date The date to parse
	 * @param {string} pattern The pattern used to parse the date with
	 * @param {Object} [config] Configuration options
	 * @param {boolean} [config.utc] Parse the date in UTC mode
	 * @param {string} [config.locale] The locale to configure the {@link DateTime} with
	 * @returns {DateTime} A new instance of the parsed date.
	 */
	static parse(date, pattern, { utc, locale } = {}) {
		return new DateTime(date, { utc, locale, pattern });
	}

	/**
	 * Returns the minimum date from the specified dates.
	 *
	 * @param  {...DateTime} dates The dates to compare.
	 * @returns {DateTime} The minimum date.
	 */
	static min(...dates) {
		return dates.reduce((a, b) => a < b ? a : b);
	}

	/**
	 * Returns the maximum date from the specified dates.
	 *
	 * @param  {...DateTime} dates The dates to compare.
	 * @returns {DateTime} The maximum date.
	 */
	static max(...dates) {
		return dates.reduce((a, b) => a < b ? b : a);
	}

	/**
	 * Create a {@link DateTime} instance at the start of a unit of time.
	 *
	 * @param {string} unit The unit of time to start at.
	 * @param {boolean} utc	Whether to use UTC mode.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	static startOf(unit, { utc, locale } = {}) {
		return new DateTime(_startOf(new BaseDateTime(new Date(), utc), unit), { locale });
	}

	/**
	 * Create a new {@link DateTime} instance at the start of a unit of time.
	 * This method is chainable.
	 *
	 * @param {string} unit The unit of time to start at.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	startOf(unit) {
		return new DateTime(_startOf(this.#baseDateTime, unit), { locale: this.#locale.name });
	}

	/**
	 * Converts a UTC date to a local date in the current time zone.
	 *
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	local() {
		if (!this.#baseDateTime.utc) return this;

		return this.#baseDateTime.isLegacyDate ? new DateTime(_convertLegacyDate(this.#baseDateTime, this.#timeZone.offset)) : new DateTime(this.valueOf());
	}

	/**
	 * Converts a local date to a UTC date.
	 *
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	utc() {
		if (this.#baseDateTime.utc) return this;

		return this.#baseDateTime.isLegacyDate ? new DateTime(_convertLegacyDate(this.#baseDateTime, this.#timeZone.offset, true)) : new DateTime(this.valueOf(), { utc: true });
	}

	/**
	 * Adds the value to the date for the specified date/time period.
	 *
	 * @param {(number|Duration)} value The value to add to the date.
	 * @param {string} [period] The period to add the value to the date.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	add(value, period) {
		return DateTime.#performOperation(this, period ? new Period(value, period) : value, DateOperation.ADD);
	}

	/**
	 * Subtracts the value from the date for the specified date/time period.
	 *
	 * @param {(number|Duration)} value The value to subtract from the date.
	 * @param {string} [period]	The period to subtract the value from the date.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	subtract(value, period) {
		return DateTime.#performOperation(this, period ? new Period(value, period) : value, DateOperation.SUBTRACT);
	}

	/**
	 * Calculates the difference between dates as a {@link Duration}.
	 *
	 * @param {DateTime} dateTime The date to calculate the difference to.
	 * @returns {Duration} The difference between the dates.
	 */
	duration(dateTime) {
		return Duration.between(this, dateTime);
	}

	/**
	 * Calculates the difference between two dates for the specified date/time period.
	 *
	 * @param {DateTime} dateTime The date to calculate the difference to.
	 * @param {string} [period] The period to calculate the difference for.
	 * @returns {number} The difference between the dates.
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
	 * @param {string} unit The unit to set.
	 * @param {number} value The value to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	set(unit, value) {
		const date = new Date(this.valueOf());
		_set(date, DateField[unit], unit == DateTime.Unit.MONTH ? value - 1 : value, this.#baseDateTime.utc);
		return new DateTime(new BaseDateTime(date, this.#baseDateTime.utc), { locale: this.#locale.name });
	}

	/**
	 * Sets the year and returns a new DateTime instance.
	 *
	 * @param {number} value The year to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	setYear(value) {
		return this.set(DateTime.Unit.YEAR, value);
	}

	/**
	 * Sets the month and returns a new DateTime instance.
	 * Note: The month is 1-based, so 1 is January and 12 is December.
	 *
	 * @param {number} value The month to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	setMonth(value) {
		return this.set(DateTime.Unit.MONTH, value);
	}

	/**
	 * Sets the day of the month and returns a new DateTime instance.
	 * Note: If the day is greater than the number of days in the month, the day will be set to the last day of the month.
	 * For example, if the date is 2019-01-31 and the month is set to February, the date will be set to 2019-02-28.
	 * If the date is 2019-03-31 and the month is set to February, the date will be set to 2019-02-28.
	 * If the date is 2020-03-31 and the month is set to February, the date will be set to 2020-02-29.
	 *
	 * @param {number} value The day of the month to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	setDay(value) {
		return this.set(DateTime.Unit.DAY, value);
	}

	/**
	 * Sets the day of the week and returns a new DateTime instance.
	 *
	 * @param {number} value The day of the week to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	setHour(value) {
		return this.set(DateTime.Unit.HOUR, value);
	}

	/**
	 * Sets the hour and returns a new DateTime instance.
	 * Note: If the hour is greater than 23, the hour will be set to 23.
	 * If the hour is less than 0, the hour will be set to 0.
	 * If the hour is 24, the hour will be set to 0 and the day will be incremented by 1.
	 * If the hour is -1, the hour will be set to 23 and the day will be decremented by 1.
	 *
	 * @param {number} value The hour to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	setMinute(value) {
		return this.set(DateTime.Unit.MINUTE, value);
	}

	/**
	 * Sets the minute and returns a new DateTime instance.
	 * Note: If the minute is greater than 59, the minute will be set to 59.
	 * If the minute is less than 0, the minute will be set to 0.
	 * If the minute is 60, the minute will be set to 0 and the hour will be incremented by 1.
	 * If the minute is -1, the minute will be set to 59 and the hour will be decremented by 1.
	 *
	 * @param {number} value The minute to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	setSecond(value) {
		return this.set(DateTime.Unit.SECOND, value);
	}

	/**
	 * Sets the second and returns a new DateTime instance.
	 * Note: If the second is greater than 59, the second will be set to 59.
	 * If the second is less than 0, the second will be set to 0.
	 * If the second is 60, the second will be set to 0 and the minute will be incremented by 1.
	 * If the second is -1, the second will be set to 59 and the minute will be decremented by 1.
	 *
	 * @param {number} value The second to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	setMillisecond(value) {
		return this.set(DateTime.Unit.MILLISECOND, value);
	}

	/**
	 * Sets the current {@link Locale} for this {@link DateTime} instance.
	 * Note: This does not change the global {@link Locale}.
	 *
	 * @todo Add global parameter??
	 * @param {string} locale The locale to set.
	 * @returns {DateTime} The new {@link DateTime} instance.
	 */
	setLocale(locale) {
		return new DateTime(this.valueOf(), { locale });
	}

	/**
	 * Gets the value for the specified unit.
	 * Note: The month is 1-based, so 1 is January and 12 is December.
	 * Note: The day of the week is 0-based, so 0 is Sunday and 6 is Saturday.
	 * Note: The hour is 0-based, so 0 is midnight and 23 is 11pm.
	 * Note: The minute is 0-based, so 0 is the first minute and 59 is the last minute.
	 * Note: The second is 0-based, so 0 is the first second and 59 is the last second.
	 * Note: The millisecond is 0-based, so 0 is the first millisecond and 999 is the last millisecond.
	 * Note: The timezone offset is in minutes.
	 * Note: The timezone offset is negative for timezones west of UTC and positive for timezones east of UTC.
	 * Note: The timezone offset is 0 for UTC.
	 *
	 * @param {string} unit The unit to get.
	 * @returns {number} The value for the specified unit.
	 */
	get(unit) {
		return this.#baseDateTime[unit];
	}

	/**
	 * Gets the year and returns it as a number.
	 *
	 * @returns {number} The year.
	 */
	getYear() {
		return this.#baseDateTime.year;
	}

	/**
	 * Gets the month and returns it as a number.
	 * Note: The month is 1-based, so 1 is January and 12 is December.
	 *
	 * @returns {number} The month.
	 */
	getMonth() {
		return this.#baseDateTime.month;
	}

	/**
	 * Gets the day of the month and returns it as a number.
	 * Note: The day of the month is 1-based, so 1 is the first day of the month and 31 is the last day of the month.
	 *
	 * @returns {number} The day of the month.
	 */
	getDay() {
		return this.#baseDateTime.day;
	}

	/**
	 * Gets the hour of the day and returns it as a number.
	 * Note: The hour is 0-based, so 0 is midnight and 23 is 11pm.
	 *
	 * @returns {number} The hour of the day.
	 */
	getHour() {
		return this.#baseDateTime.hour;
	}

	/**
	 * Gets the minute of the hour and returns it as a number.
	 * Note: The minute is 0-based, so 0 is the first minute and 59 is the last minute.
	 *
	 * @returns {number} The minute of the hour.
	 */
	getMinute() {
		return this.#baseDateTime.minute;
	}

	/**
	 * Gets the second of the minute and returns it as a number.
	 * Note: The second is 0-based, so 0 is the first second and 59 is the last second.
	 *
	 * @returns {number} The second of the minute.
	 */
	getSecond() {
		return this.#baseDateTime.second;
	}

	/**
	 * Gets the millisecond of the second and returns it as a number.
	 * Note: The millisecond is 0-based, so 0 is the first millisecond and 999 is the last millisecond.
	 *
	 * @returns {number} The millisecond of the second.
	 */
	getMillisecond() {
		return this.#baseDateTime.millisecond;
	}

	/**
	 * Returns the current {@link Locale} for this {@link DateTime} instance.
	 * Note: This does not return the global {@link Locale}.
	 * Note: If no locale was set, the global {@link Locale} will be returned.
	 * Note: If the global {@link Locale} was not set, the default {@link Locale} will be returned.
	 *
	 * @returns {Locale} The current {@link Locale} for this {@link DateTime} instance.
	 */
	getLocale() {
		return this.#locale;
	}

	/**
	 * Returns the current time zone.
	 * Note: If no time zone was set, the global time zone will be returned.
	 * Note: If the global time zone was not set, the default time zone will be returned.
	 *
	 * @returns {string} The current time zone.
	 */
	getTimeZone() {
		return this.#timeZone.location;
	}

	/**
	 * Returns the current time zone offset in minutes.
	 *
	 * @returns {number} The current time zone offset in minutes.
	 */
	getTimeZoneOffset() {
		return this.#timeZone.offset;
	}

	/**
	 * Returns the current time zone name.
	 * Note: If no time zone name format was set, the global time zone name format will be returned.
	 * Note: If the global time zone name format was not set, the default time zone name format will be returned.
	 *
	 * @param {string} timeZoneFormat The time zone name format to use.
	 * @returns {string} The current time zone name.
	 */
	getTimeZoneName(timeZoneFormat) {
		return this.#timeZone.getName(timeZoneFormat);
	}

	/**
	 * Returns the number of days in the current month.
	 *
	 * @returns {number} The number of days in the current month.
	 */
	getDaysInMonth() {
		return this.#baseDateTime.daysInMonth;
	}

	/**
	 * Returns the day of the week.
	 * Note: The day of the week is 0-based, so 0 is Sunday and 6 is Saturday.
	 *
	 * @returns {number} The number of days in the current year.
	 */
	getDayOfTheWeek() {
		return this.#baseDateTime.dayOfTheWeek;
	}

	/**
	 * Returns the day of the year. The day of the year is the number of days that have passed since the beginning of the year.
	 * Note: The day of the year is 1-based, so 1 is the first day of the year and 366 is the last day of the year.
	 * Note: Leap years have 366 days.
	 * Note: Non-leap years have 365 days.
	 *
	 * @returns {number} The number of days in the current year.
	 */
	getDayOfYear() {
		return this.#baseDateTime.dayOfTheYear;
	}

	/**
	 * Determines if the current date is valid.
	 * Note: A date is valid if it is within the range of 0000-01-01 to 9999-12-31.
	 * Note: A date is invalid if it is outside the range of 0000-01-01 to 9999-12-31.
	 *
	 * @returns {boolean} True if the current date is valid, otherwise false.
	 */
	isValid() {
		return this.#baseDateTime.isValid;
	}

	/**
	 * Determines if the current date is in UTC time.
	 * Note: A date is in UTC time if it was created with the UTC time zone.
	 * Note: A date is not in UTC time if it was created with a non-UTC time zone.
	 *
	 * @returns {boolean} True if the current date is in UTC time, otherwise false.
	 */
	isUtc() {
		return this.#baseDateTime.utc;
	}

	/**
	 * Determines if the current date is in daylight savings time.
	 * Note: A date is in daylight savings time if it was created with a time zone that is currently in daylight savings time.
	 * Note: A date is not in daylight savings time if it was created with a time zone that is currently not in daylight savings time.
	 * Note: A date is not in daylight savings time if it was created with the UTC time zone.
	 * Note: A date is not in daylight savings time if it was created with a time zone that does not have daylight savings time.
	 *
	 * @returns {boolean} True if the current date is in daylight savings time, otherwise false.
	 */
	isDaylightSavingsTime() {
		return this.#baseDateTime.utc ? false : this.#baseDateTime.isDaylightSavingsTime;
	}

	/**
	 * Determines if the current date is in a leap year.
	 * Leap years are years that are divisible by 4, but not by 100, unless they are also divisible by 400.
	 *
	 * @see https://en.wikipedia.org/wiki/Leap_year
	 * @returns {boolean} True if the current date is in a leap year, otherwise false.
	 */
	isLeapYear() {
		return !(this.#baseDateTime.year & 3 || this.#baseDateTime.year & 15 && !(this.#baseDateTime.year % 25));
	}

	/**
	 * Convert DateTime to native Date
	 *
	 * @returns {Date} Native Date
	 */
	toDate() {
		return new Date(this.valueOf());
	}

	/**
	 * Determines if one date is equal to the other.
	 * Note: Two dates are equal if they have the same year, month, day, hour, minute, second, and millisecond.
	 * Note: Two dates are not equal if they have different years, months, days, hours, minutes, seconds, or milliseconds.
	 * Note: Two dates are not equal if one is in UTC time and the other is not in UTC time.
	 * Note: Two dates are not equal if one is in daylight savings time and the other is not in daylight savings time.
	 * Note: Two dates are not equal if one is in a leap year and the other is not in a leap year.
	 * Note: Two dates are not equal if one is in a time zone that has daylight savings time and the other is not in a time zone that has daylight savings time.
	 *
	 * @param {DateTime} dateTime The date to compare to.
	 * @returns {boolean} True if the dates are equal, otherwise false.
	 */
	equals(dateTime) {
		return this.#baseDateTime.date.valueOf() === dateTime.valueOf();
	}

	/**
	 * Duplicates the existing {@link DateTime} as a new instance.
	 * Note: The new {@link DateTime} instance will have the same year, month, day, hour, minute, second, and millisecond.
	 * Note: The new {@link DateTime} instance will have the same time zone as the original {@link DateTime} instance.
	 * Note: The new {@link DateTime} instance will have the same locale as the original {@link DateTime} instance.
	 * Note: The new {@link DateTime} instance will not be the same instance as the original {@link DateTime} instance.
	 * Note: The new {@link DateTime} instance will not be linked to the original {@link DateTime} instance.
	 *
	 * @returns {DateTime} A new {@link DateTime} instance.
	 */
	clone() {
		return new DateTime(this.valueOf(), { utc: this.#baseDateTime.utc, locale: this.#locale.name });
	}

	/**
	 * Returns the primitive value of a DateTime object
	 * Note: The primitive value of a DateTime object is the number of milliseconds since 1970-01-01T00:00:00.000Z.
	 * Note: The primitive value of a DateTime object is the same as the primitive value of a Date object.
	 *
	 * @returns {number} The primitive value of a DateTime object.
	 */
	valueOf() {
		return this.#baseDateTime.date.valueOf();
	}

	/**
	 * Formats the date according to the specified pattern.
	 * Note: The pattern is a string that defines the format of the date.
	 * Note: The pattern is a combination of date and time format symbols.
	 *
	 * @param {string} [pattern] The pattern to use for formatting the date.
	 * @param {boolean} [utc] Whether to use UTC time.
	 * @returns {string} The formatted date.
	 */
	format(pattern = DateTime.Pattern.RFC_1123, utc = this.#baseDateTime.utc) {
		return DateFormatter.format(this, pattern, utc);
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 *
	 * @returns {string} A string representation of a date.
	 */
	toString() {
		return DateFormatter.format(this, this.#baseDateTime.utc ? DateTime.Pattern.ISO_DATE_TIME : DateTime.Pattern.DEFAULT, this.#baseDateTime.utc);
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 *
	 * @param {boolean} [short] Whether to use short date format.
	 * @returns {string} A string representation of a date.
	 */
	toLocaleString(short = false) {
		return DateFormatter.format(this, short ? this.#locale?.patterns.ABBR_DATE_TIME : this.#locale?.patterns.DATE_TIME, this.#baseDateTime.utc);
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 *
	 * @param {boolean} [short] Whether to use short date format.
	 * @returns {string} A string representation of a date.
	 */
	toLocaleDateString(short = false) {
		return DateFormatter.format(this, short ? this.#locale?.patterns.ABBR_DATE : this.#locale?.patterns.DATE, this.#baseDateTime.utc);
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 *
	 * @param {boolean} [short] Whether to use short time format.
	 * @returns {string} A string representation of a date.
	 */
	toLocaleTimeString(short = false) {
		return DateFormatter.format(this, short ? this.#locale?.patterns.TIME : this.#locale?.patterns.TIME_WITH_SECONDS, this.#baseDateTime.utc);
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 * The date is formatted using the UTC time zone.
	 *
	 * @returns {string} A string representation of a date.
	 */
	toUtcString() {
		return this.format(DateTime.Pattern.RFC_1123, true);
	}

	/**
	 * Returns a string representation of a date. The format of the string depends on the locale.
	 * The date is formatted using the local time zone.
	 *
	 * @returns {string} A string representation of a date.
	 */
	get [Symbol.toStringTag]() {
		return 'DateTime';
	}

	/**
	 * Perform an arithmetic operation on a {@link DateTime} instance using the provided value and operation type
	 *
	 * @param {DateTime} dateTime The {@link DateTime} instance to perform the operation on.
	 * @param {(Duration|Period)} value The value to use for the operation.
	 * @param {string} operationType The operation type to perform.
	 * @returns {DateTime} A new {@link DateTime} instance with the result of the operation.
	 */
	static #performOperation(dateTime, value, operationType) {
		switch (_type(value)) {
			case Duration: return new DateTime(_processDatePeriodOperations(new Date(dateTime.valueOf()), value.periods(), operationType, dateTime.#baseDateTime.utc), { locale: dateTime.#locale.name });
			case Period: return value[operationType](dateTime);
			default: return dateTime;
		}
	}
}