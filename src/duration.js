import { MillisecondsIn, PeriodUnit } from './constants.js';
import Period from './period.js';
/** @typedef {import('./date-time.js').default} DateTime */

/**
 * Class representation of a Duration of time
 *
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
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
	 * Creates a new {@link Duration} instance.
	 *
	 * @param {Object} config The configuration object.
	 * @param {number} [config.years=0] The number of years.
	 * @param {number} [config.months=0] The number of months.
	 * @param {number} [config.days=0] The number of days.
	 * @param {number} [config.hours=0] The number of hours.
	 * @param {number} [config.minutes=0] The number of minutes.
	 * @param {number} [config.seconds=0] The number of seconds.
	 * @param {number} [config.milliseconds=0] The number of milliseconds.
	 * @param {number} [config.total] The total number of milliseconds.
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
	 * Creates a new {@link Duration} instance from a timestamp in milliseconds.
	 *
	 * @static
	 * @param {number} timestamp The timestamp in milliseconds.
	 * @returns {Duration} A new instance of {@link Duration} object.
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
	 * Creates a new {@link Duration} instance from a start and end {@link DateTime} instance.
	 * The start date must be before the end date.
	 *
	 * @static
	 * @param {DateTime} startDate The start date.
	 * @param {DateTime} endDate The end date.
	 * @returns {Duration} A new instance of {@link Duration} object.
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
	 * Gets the number of years.
	 *
	 * @readonly
	 * @returns {number} The number of years.
	 */
	get years() {
		return this.#years.value;
	}

	/**
	 * Gets the number of months.
	 *
	 * @readonly
	 * @returns {number} The number of months.
	 */
	get months() {
		return this.#months.value;
	}

	/**
	 * Gets the number of days.
	 *
	 * @readonly
	 * @returns {number} The number of days.
	 */
	get days() {
		return this.#days.value;
	}

	/**
	 * Gets the number of hours.
	 *
	 * @readonly
	 * @returns {number} The number of hours.
	 */
	get hours() {
		return this.#hours.value;
	}

	/**
	 * Gets the number of minutes.
	 *
	 * @readonly
	 * @returns {number} The number of minutes.
	 */
	get minutes() {
		return this.#minutes.value;
	}

	/**
	 * Gets the number of seconds.
	 *
	 * @readonly
	 * @returns {number} The number of seconds.
	 */
	get seconds() {
		return this.#seconds.value;
	}

	/**
	 * Gets the number of milliseconds.
	 *
	 * @readonly
	 * @returns {number} The number of milliseconds.
	 */
	get milliseconds() {
		return this.#milliseconds.value;
	}

	/**
	 * Gets the duration in years.
	 * The value is floored.
	 *
	 * @readonly
	 * @returns {number} The duration in years.
	 */
	asYears() {
		return Math.floor(this.#total / MillisecondsIn.YEARS);
	}

	/**
	 * Gets the duration in months.
	 * The value is floored.
	 * A month is 30 days.
	 * A month is 1/12 of a year.
	 *
	 * @readonly
	 * @returns {number} The duration in months.
	 */
	asMonths() {
		return Math.floor(this.#total / MillisecondsIn.MONTHS);
	}

	/**
	 * Gets the duration in weeks.
	 * The value is floored.
	 * A week is 7 days.
	 * A week is 1/52 of a year.
	 *
	 * @readonly
	 * @returns {number} The duration in weeks.
	 */
	asWeeks() {
		return Math.floor(this.#total / MillisecondsIn.WEEKS);
	}

	/**
	 * Gets the duration in days.
	 * The value is floored.
	 * A day is 24 hours.
	 * A day is 1440 minutes.
	 * A day is 86400 seconds.
	 * A day is 86400000 milliseconds.
	 * A day is 1/365 of a year.
	 * A day is 1/12 of a month.
	 * A day is 1/7 of a week.
	 *
	 * @readonly
	 * @returns {number} The duration in days.
	 */
	asDays() {
		return Math.floor(this.#total / MillisecondsIn.DAYS);
	}

	/**
	 * Gets the duration in hours.
	 * The value is floored.
	 * An hour is 60 minutes.
	 * An hour is 3600 seconds.
	 * An hour is 3600000 milliseconds.
	 * An hour is 1/24 of a day.
	 * An hour is 1/1440 of a month.
	 * An hour is 1/8760 of a year.
	 * An hour is 1/168 of a week.
	 *
	 * @readonly
	 * @returns {number} The duration in hours.
	 */
	asHours() {
		return Math.floor(this.#total / MillisecondsIn.HOURS);
	}

	/**
	 * Gets the duration in minutes.
	 * The value is floored.
	 * A minute is 60 seconds.
	 * A minute is 60000 milliseconds.
	 * A minute is 1/60 of an hour.
	 * A minute is 1/1440 of a day.
	 *
	 * @readonly
	 * @returns {number} The duration in minutes.
	 */
	asMinutes() {
		return Math.floor(this.#total / MillisecondsIn.MINUTES);
	}

	/**
	 * Gets the duration in seconds.
	 * The value is floored.
	 * A second is 1000 milliseconds.
	 * A second is 1/60 of a minute.
	 * A second is 1/3600 of an hour.
	 * A second is 1/86400 of a day.
	 *
	 * @readonly
	 * @returns {number} The duration in seconds.
	 */
	asSeconds() {
		return Math.floor(this.#total / MillisecondsIn.SECONDS);
	}

	/**
	 * Gets the duration in milliseconds.
	 * The value is floored.
	 * A millisecond is 1/1000 of a second.
	 * A millisecond is 1/60000 of a minute.
	 * A millisecond is 1/3600000 of an hour.
	 * A millisecond is 1/86400000 of a day.
	 *
	 * @readonly
	 * @returns {number} The duration in milliseconds.
	 */
	asMilliseconds() {
		return this.#total;
	}

	/**
	 * Gets the duration as a {@link Period}.
	 *
	 * @readonly
	 * @returns {Period} The duration as a {@link Period}.
	 */
	asPeriod() {
		return new Period(this.#total, PeriodUnit.MILLISECONDS);
	}

	/**
	 * Normalizes the values as a {@link Duration}.
	 * This method will not mutate the current instance.
	 * The values will be normalized to the largest unit possible.
	 * For example, 90 seconds will be normalized to 1 minute and 30 seconds.
	 * The values will be floored.
	 *
	 * @readonly
	 * @returns {Duration} The normalized duration.
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
	 * Gets the periods for this duration.
	 * The periods are ordered from largest to smallest.
	 * The periods are normalized.
	 * The periods are floored.
	 *
	 * @readonly
	 * @returns {Array<Period>} The periods for this duration.
	 */
	periods() {
		return [ this.#years,	this.#months,	this.#days,	this.#hours, this.#minutes,	this.#seconds, this.#milliseconds ];
	}

	/**
	 * Gets the values for this duration.
	 * The values are ordered from largest to smallest.
	 * The values are normalized.
	 * The values are floored.
	 *
	 * @readonly
	 * @returns {Object<string, number>} The values for this duration.
	 */
	values() {
		return { years: this.#years.value, months: this.#months.value, days: this.#days.value, hours: this.#hours.value, minutes: this.#minutes.value, seconds: this.#seconds.value, milliseconds: this.#milliseconds.value };
	}

	/**
	 * Gets the name of this type.
	 * This is used by the `typeof` operator.
	 *
	 * @returns {string} The name of this type.
	 */
	get [Symbol.toStringTag]() {
		return 'Duration';
	}
}