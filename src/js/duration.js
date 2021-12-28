import Period from './period.js';
import { Type, Types } from './types.js';
import { dateTimeFields, _dateComparatorDescending, unitsInMilliseconds } from './constants.js';

const defaultValues = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

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
		this._total = total ?? milliseconds + seconds * unitsInMilliseconds.SECONDS + minutes * unitsInMilliseconds.MINUTES + hours * unitsInMilliseconds.HOURS + days * unitsInMilliseconds.DAYS + months * unitsInMilliseconds.MONTHS + years * unitsInMilliseconds.YEARS;
	}

	/**
	 *
	 * @param {number} timestamp
	 * @returns {Duration}
	 */
	static fromTimestamp(timestamp) {
		const total = timestamp;
		const values = { ...defaultValues };

		let unitInMilliseconds;
		for (const unit of Object.keys(values)) {
			unitInMilliseconds = unitsInMilliseconds[unit.toUpperCase()];
			values[unit] = Math.floor(timestamp / unitInMilliseconds);
			timestamp %= unitInMilliseconds;
		}

		return new Duration({ ...values, total: total });
	}

	/**
	 *
	 * @param {DateTime} startDate
	 * @param {DateTime} endDate
	 * @returns {Duration}
	 */
	static between(startDate, endDate) {
		[ endDate, startDate ] = [startDate, endDate].sort(_dateComparatorDescending);
		const values = { ...defaultValues, total: endDate - startDate };
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
		return this._years.value;
	}

	get months() {
		return this._months.value;
	}

	get days() {
		return this._days.value;
	}

	get hours() {
		return this._hours.value;
	}

	get minutes() {
		return this._minutes.value;
	}

	get seconds() {
		return this._seconds.value;
	}

	get milliseconds() {
		return this._milliseconds.value;
	}

	asYears() {
		return Math.floor(this._total / unitsInMilliseconds.YEARS);
	}

	asMonths() {
		return Math.floor(this._total / unitsInMilliseconds.MONTHS);
	}

	asWeeks() {
		return Math.floor(this._total / unitsInMilliseconds.WEEKS);
	}

	asDays() {
		return Math.floor(this._total / unitsInMilliseconds.DAYS);
	}

	asHours() {
		return Math.floor(this._total / unitsInMilliseconds.HOURS);
	}

	asMinutes() {
		return Math.floor(this._total / unitsInMilliseconds.MINUTES);
	}

	asSeconds() {
		return Math.floor(this._total / unitsInMilliseconds.SECONDS);
	}

	asMilliseconds() {
		return this._total;
	}

	normalize() {
		const values = this.values();
		if (values.milliseconds >= 1e3) {
			values.seconds += Math.floor(values.milliseconds / 1e3);
			values.milliseconds %= 1e3;
		}

		if (values.seconds >= 60) {
			values.minutes += Math.floor(values.seconds / 60);
			values.seconds %= 60;
		}

		if (values.minutes >= 60) {
			values.hours += Math.floor(values.minutes / 60);
			values.minutes %= 60;
		}

		if (values.hours >= 24) {
			values.days += Math.floor(values.hours / 24);
			values.hours %= 24;
		}

		if (values.days >= 30) {
			values.months += Math.floor(values.days / 30);
			values.days %= 30;
		}

		if (values.months >= 12) {
			values.years += Math.floor(values.months / 12);
			values.months %= 12;
		}

		return new Duration(values);
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

Object.defineProperty(Type, 'isDuration', { value: (object) => object instanceof Duration });
Object.defineProperty(Types, 'DURATION', { enumerable: true, value: Duration.name });