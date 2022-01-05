import './extensions.js';
import Locale from './locale.js';
import Duration from './duration.js';
import DateParser from './date-parser.js';
import { Types, Type } from './types.js';
import { dateTimePatterns, dateTimeFields, dateTimeFieldValues, i18n, INVALID_DATE, regExps, dateTimePeriods, _dateFromArray, _set, _get, dateOperations, _isLeapYear, _isDaylightSavingsTime, unitsInMilliseconds, _formatTimeZone } from './constants.js';

class DateTime {
	/**
	 * Native JavaScript Date wrapper. Main features include
	 *
	 * Parsing of ISO and Locale numerical dates.
	 * Formatting using custom patterns.
	 * Ability to calculate the difference between two dates.
	 * Ability to add and subtract date periods from an existing DateTime instance.
	 * Ability to create and convert dates either in UTC or Local timezones.
	 * DateTime instances are immutable.
	 *
	 * @param {string|number|Date|DateTime|Array<number>|boolean|null|undefined} [date]
	 * @param {Object} [config]
	 * @param {string} [config.pattern]
	 * @param {boolean} [config.utc]
	 * @returns {DateTime}
	 */
	constructor(date, { pattern, utc = false, locale = 'en-US' } = {}) {
		this._locale = new Locale({ name: locale, ...i18n.locales[locale] });

		Object.assign(dateTimePatterns, this._locale.patterns);

		switch(Type.of(date)) {
			case Types.DATE_TIME: case Types.DATE: {
				this._date = new Date(+date);
				break;
			}
			case Types.STRING: {
				this._date = new DateParser(this._locale.dateParserPattern).parse(date, utc, pattern);
				break;
			}
			case Types.NUMBER: {
				this._date = new Date(date);
				break;
			}
			case Types.ARRAY: {
				--date[1];
				this._date = _dateFromArray(date, utc);
				break;
			}
			case Types.BOOLEAN: {
				this._date = new Date();
				utc = date;
				break;
			}
			case Types.UNDEFINED: case Types.NULL: {
				this._date = new Date();
				break;
			}
			default: this._date = new Date('');
		}

		this._utc = utc;
		this._valid = this._date.toString() !== INVALID_DATE;
	}

	static Locale = Locale;
	static Duration = Duration;
	static patterns = dateTimePatterns;
	static fields = dateTimeFields;
	static periods = dateTimePeriods;
	static timeZoneFormats = i18n.timeZoneFormats;

	/**
	 *
	 * @param {Locale} locale
	 */
	static addLocale(locale) {
		const { name, ...rest } = locale;
		i18n.locales[name] = rest;
	}

	/**
	 * Creates a DateTime object in UTC mode
	 *
	 * @memberOf DateTime
	 * @param {string|number|Date|DateTime} [date]
	 * @param {string} [pattern]
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
	 * @returns {DateTime}
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
	 * @returns {DateTime|null}
	 */
	static orNull(date, { pattern, utc } = {}) {
		const dateTime = new DateTime(date, { pattern, utc });
		return dateTime.isValid() ? dateTime : null;
	}

	/**
	 *
	 * @param  {...DateTime} dates
	 * @returns
	 */
	static min(...dates) {
		return dates.reduce((a, b) => a < b ? a : b);
	}

	/**
	 *
	 * @param  {...DateTime} dates
	 * @returns
	 */
	static max(...dates) {
		return dates.reduce((a, b) => a < b ? b : a);
	}

	local() {
		if (!this._utc) {
			return this;
		}

		const dateTime = new DateTime(this, { utc: false });
		// Ignore JavaScript's offset for ancient dates and calculate the milliseconds from the difference between the current offset and the value from the locale string
		if (dateTime._date.getTimezoneOffset() % 60 !== 0) {
			dateTime._date.setMilliseconds(dateTime.getMilliseconds() - dateTime.getTimezoneOffset() * unitsInMilliseconds.MINUTES - _convertOffsetToMilliseconds(dateTime._date, dateTime._locale.name));
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
			dateTime._date.setUTCMilliseconds(dateTime.getMilliseconds() + this.getTimezoneOffset() * unitsInMilliseconds.MINUTES + _convertOffsetToMilliseconds(dateTime._date, dateTime._locale.name));
		}

		return dateTime;
	}

	/**
	 *
	 * @param {number|Duration} value
	 * @param {Period|String} [period]
	 */
	add(value, period) {
		return _performOperation(this, value, period, dateOperations.ADD);
	}

	/**
	 *
	 * @param {number|Duration} value
	 * @param {Object|String} [period]
	 */
	subtract(value, period) {
		return _performOperation(this, value, period, dateOperations.SUBTRACT);
	}

	/**
	 *
	 * @param {DateTime} dateTime
	 * @returns {Duration}
	 */
	duration(dateTime) {
		return Duration.between(this, dateTime);
	}

	/**
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
		return new DateTime(this, { locale });
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

	getTimezone(format = DateTime.timeZoneFormats.SHORT) {
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
		z: () => dateTime.isUtc() ? 'UTC' : dateTime.getLocale().timeZone.name[DateTime.timeZoneFormats.SHORT][offset],
		zzz: () => `(${dateTime.isUtc() ? 'UTC' : dateTime.getLocale().timeZone.name[DateTime.timeZoneFormats.LONG][offset]})`,
		Z: () => dateTime.isUtc() ? 'Z' : _formatOffset(offset).splice(3, ':'),
		ZZ: () => _formatOffset(offset),
		Do: () => `${day}${['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10) * day % 10]}`
	};

	return pattern.replace(regExps.formattingTokens, ($0) => $0 in flags ? flags[$0]() : $0.slice(1, $0.length - 1));
};

/**
 * Converts numeric timezone offset in minutes to hours and formats it (i.e. 300 -> -0500)
 *
 * @param {number} offset
 * @returns {string}
 */
const _formatOffset = (offset) => (offset > 0 ? '-' : '+') + `${(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60)}`.padStart(4, '0');

const _convertOffsetToMilliseconds = (date, locale) => {
	const offset = _formatTimeZone(date, DateTime.timeZoneFormats.LONG, locale);
	const [ sign, hours, minutes, seconds ] = offset.match(regExps.timeZoneOffset).slice(1);

	return +(sign + new Duration({ hours, minutes, seconds }).asMilliseconds());
}

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
		const date = new Date(+dateTime);

		for (const period of (operationType == dateOperations.ADD ? value.periods().reverse() : value.periods())) {
			if (period.value > 0) {
				_set(date, period.field, _get(date, period.field, dateTime._utc) + (operationType == dateOperations.SUBTRACT ? period.value * -1 : period.value), dateTime._utc);
			}
		}

		return new DateTime(date, { utc: dateTime._utc });
	}

	switch(Type.of(period)) {
		case Types.PERIOD: return period[operationType](dateTime, value);
		case Types.STRING: return DateTime.periods[period.toUpperCase()][operationType](dateTime, value);
		default: return dateTime;
	}
};

export default DateTime;