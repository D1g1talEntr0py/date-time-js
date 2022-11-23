// @ts-nocheck
import { MillisecondsIn, PeriodUnit } from './constants.js';
import Period from './period.js';
/** @typedef {import('./date-time.js').default} DateTime */

/**
 * Class representation of a Duration *
 *
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class Duration {
	#years;
	#months;
	#days;
	#hours;
	#minutes;
	#seconds;
	#milliseconds;
	#total;

	/**
	 * Creates a new {@link Duration} instance
	 *
	 * @param {Object} config
	 * @param {number} [config.years=0]
	 * @param {number} [config.months=0]
	 * @param {number} [config.days=0]
	 * @param {number} [config.hours=0]
	 * @param {number} [config.minutes=0]
	 * @param {number} [config.seconds=0]
	 * @param {number} [config.milliseconds=0]
	 * @param {number} [config.total]
	 */
	constructor({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0, total } = {}) {
		this.#years = new Period(years, PeriodUnit.YEARS);
		this.#months = new Period(months, PeriodUnit.MONTHS);
		this.#days = new Period(days, PeriodUnit.DAYS);
		this.#hours = new Period(hours, PeriodUnit.HOURS);
		this.#minutes = new Period(minutes, PeriodUnit.MINUTES);
		this.#seconds = new Period(seconds, PeriodUnit.SECONDS);
		this.#milliseconds = new Period(milliseconds, PeriodUnit.MILLISECONDS);
		this.#total = total ?? milliseconds + seconds * MillisecondsIn.SECONDS + minutes * MillisecondsIn.MINUTES + hours * MillisecondsIn.HOURS + days * MillisecondsIn.DAYS + months * MillisecondsIn.MONTHS + years * MillisecondsIn.YEARS;
		Object.freeze(this);
	}

	/**
	 *
	 * @param {number} timestamp
	 * @returns {Duration}
	 */
	static fromTimestamp(timestamp) {
		const values = {};
		const total = timestamp = Math.abs(timestamp);

		for (const [ unit, unitInMilliseconds ] of Object.entries(MillisecondsIn)) {
			values[unit.toLowerCase()] = Math.floor(timestamp / unitInMilliseconds);
			timestamp %= unitInMilliseconds;
		}

		return new Duration({ ...values, total });
	}

	/**
	 *
	 * @param {DateTime} startDate
	 * @param {DateTime} endDate
	 * @returns {Duration}
	 */
	static between(startDate, endDate) {
		// Ensure correct order of dates
		[ endDate, startDate ] = [startDate, endDate].sort((d1, d2) => d2 - d1);
		const values = { total: endDate - startDate };
		values.years = endDate.getYear() - startDate.getYear();
		values.months = endDate.getMonth() - startDate.getMonth();
		values.days = endDate.getDay() - startDate.getDay();
		values.hours = endDate.getHour() - startDate.getHour();
		values.minutes = endDate.getMinute() - startDate.getMinute();
		values.seconds = endDate.getSecond() - startDate.getSecond();
		values.milliseconds = endDate.getMillisecond() - startDate.getMillisecond();

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

	/**
	 *
	 * @returns {number}
	 */
	get years() {
		return this.#years.value;
	}

	/**
	 *
	 * @returns {number}
	 */
	get months() {
		return this.#months.value;
	}

	/**
	 *
	 * @returns {number}
	 */
	get days() {
		return this.#days.value;
	}

	/**
	 *
	 * @returns {number}
	 */
	get hours() {
		return this.#hours.value;
	}

	/**
	 *
	 * @returns {number}
	 */
	get minutes() {
		return this.#minutes.value;
	}

	/**
	 *
	 * @returns {number}
	 */
	get seconds() {
		return this.#seconds.value;
	}

	/**
	 *
	 * @returns {number}
	 */
	get milliseconds() {
		return this.#milliseconds.value;
	}

	/**
	 *
	 * @returns {number}
	 */
	asYears() {
		return Math.floor(this.#total / MillisecondsIn.YEARS);
	}

	/**
	 *
	 * @returns {number}
	 */
	asMonths() {
		return Math.floor(this.#total / MillisecondsIn.MONTHS);
	}

	/**
	 *
	 * @returns {number}
	 */
	asWeeks() {
		return Math.floor(this.#total / MillisecondsIn.WEEKS);
	}

	/**
	 *
	 * @returns {number}
	 */
	asDays() {
		return Math.floor(this.#total / MillisecondsIn.DAYS);
	}

	/**
	 *
	 * @returns {number}
	 */
	asHours() {
		return Math.floor(this.#total / MillisecondsIn.HOURS);
	}

	/**
	 *
	 * @returns {number}
	 */
	asMinutes() {
		return Math.floor(this.#total / MillisecondsIn.MINUTES);
	}

	/**
	 *
	 * @returns {number}
	 */
	asSeconds() {
		return Math.floor(this.#total / MillisecondsIn.SECONDS);
	}

	/**
	 *
	 * @returns {number}
	 */
	asMilliseconds() {
		return this.#total;
	}

	/**
	 *
	 * @returns {Period}
	 */
	asPeriod() {
		return new Period(this.#total, PeriodUnit.MILLISECONDS);
	}

	/**
	 *
	 * @returns {Duration}
	 */
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

	/**
	 *
	 * @returns {Array<Period>} The periods for this duration.
	 */
	periods() {
		return [ this.#years,	this.#months,	this.#days,	this.#hours, this.#minutes,	this.#seconds, this.#milliseconds ];
	}

	/**
	 *
	 * @returns {Object.<string, number>}
	 */
	values() {
		return { years: this.#years.value, months: this.#months.value, days: this.#days.value, hours: this.#hours.value, minutes: this.#minutes.value, seconds: this.#seconds.value, milliseconds: this.#milliseconds.value };
	}

	/**
	 *
	 * @returns {string}
	 */
	get [Symbol.toStringTag]() {
		return 'Duration';
	}
}