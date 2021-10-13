import Period from './period.js';
import { Type, Types } from './types.js';
import { dateTimeFields, _dateComparatorDescending } from './constants.js';

export default class Duration {
	/**
	 *
	 * @param {Object} config
	 * @param {number} [config.years]
	 * @param {number} [config.months]
	 * @param {number} [config.days]
	 * @param {number} [config.hours]
	 * @param {number} [config.minutes]
	 * @param {number} [config.seconds]
	 * @param {number} [config.milliseconds]
	 * @param {number} [config.total]
	 */
	constructor({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0, total } = {}) {
		this._years = new Period(dateTimeFields.YEAR, years);
		this._months = new Period(dateTimeFields.MONTH, months);
		this._days = new Period(dateTimeFields.DAY, days);
		this._hours = new Period(dateTimeFields.HOURS, hours);
		this._minutes = new Period(dateTimeFields.MINUTES, minutes);
		this._seconds = new Period(dateTimeFields.SECONDS, seconds);
		this._milliseconds = new Period(dateTimeFields.MILLISECONDS, milliseconds);
		this._total = total ?? milliseconds + seconds * 1e3 + minutes * 6e4 + hours * 3.6e6 + days * 8.64e7 + months * 2.628e9 + years * 3.1556952e10;
	}

	/**
	 *
	 * @param {number} timestamp
	 * @returns {Duration}
	 */
	static fromTimestamp(timestamp) {
		const values = { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, total: timestamp };
		values.milliseconds = timestamp % 1e3;
		timestamp = Math.floor(timestamp / 1e3);
		values.seconds = timestamp % 60;
		timestamp = Math.floor(timestamp / 60);
		values.minutes = timestamp % 60;
		timestamp = Math.floor(timestamp / 60);
		values.hours = timestamp % 24;
		timestamp = Math.floor(timestamp / 24);
		values.days = timestamp % 365;
		timestamp = Math.floor(timestamp / 365);
		values.years = timestamp;

		return new Duration(values);
	}

	/**
	 *
	 * @param {DateTime} startDate
	 * @param {DateTime} endDate
	 * @returns {Duration}
	 */
	static between(startDate, endDate) {
		[ endDate, startDate ] = [startDate, endDate].sort(_dateComparatorDescending);
		const values = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, total: endDate - startDate };
		values.years = endDate.getYear() - startDate.getYear();
		values.months = endDate.getMonth() - startDate.getMonth();
		values.days = endDate.getDay() - startDate.getDay();
		values.hours = endDate.getHours() - startDate.getHours();
		values.minutes = endDate.getMinutes() - startDate.getMinutes();
		values.seconds = endDate.getSeconds() - startDate.getSeconds();
		values.milliseconds = endDate.getMilliseconds() - startDate.getMilliseconds();

		if (values.milliseconds < 0) {
			values.seconds--;
			values.milliseconds += 1000;
		}

		if (values.seconds < 0) {
			values.minutes--;
			values.seconds += 60;
		}

		if (values.minutes < 0) {
			values.hours--;
			values.minutes += 60;
		}

		if (values.hours < 0) {
			values.days--;
			values.hours += 24;
		}

		if (values.days < 0) {
			values.months--;
			values.days += startDate.getDaysInMonth();
		}

		if (values.months < 0) {
			values.years--;
			values.months += 12;
		}

		return new Duration(values);
	}

	get years() {
		return this._years;
	}

	get months() {
		return this._months;
	}

	get days() {
		return this._days;
	}

	get hours() {
		return this._hours;
	}

	get minutes() {
		return this._minutes;
	}

	get seconds() {
		return this._seconds;
	}

	get milliseconds() {
		return this._milliseconds;
	}

	asYears() {
		return this._years.value;
	}

	asMonths() {
		return this._months.value + this._years.value * 12;
	}

	asWeeks() {
		return Math.floor(this._total / 6.048e8);
	}

	asDays() {
		return Math.floor(this._total / 8.64e7);
	}

	asHours() {
		return Math.floor(this._total / 3.6e6);
	}

	asMinutes() {
		return Math.floor(this._total / 6e4);
	}

	asSeconds() {
		return Math.floor(this._total / 1e3);
	}

	asMilliseconds() {
		return this._total;
	}

	periods() {
		return [ this._years,	this._months,	this._days,	this._hours, this._minutes,	this._seconds, this._milliseconds ];
	}

	values() {
		return { years: this._years.value, months: this._months.value, days: this._days.value, hours: this._hours.value, minutes: this._minutes.value, seconds: this._seconds.value, milliseconds: this._milliseconds.value };
	}

	get [Symbol.toStringTag]() {
    return Duration.name;
  }
}

Type.isDuration = (object) => object instanceof Duration;
Types.DURATION = Duration.name;