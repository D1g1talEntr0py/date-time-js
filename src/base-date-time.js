import { _dateFromArray, _get } from './utils.js';
import { DateField, DateTimeUnit, MillisecondsIn } from './constants.js';

/**
 * BaseDateTime - A class to hold the basic properties of a date
 *
 * @module {BaseDateTime} base-date-time
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
 */
export default class BaseDateTime {
	/** @type {Date} */
	#date;
	/** @type {boolean} */
	#utc;
	/** @type {number} */
	#year;
	/** @type {number} */
	#month;
	/** @type {number} */
	#day;
	/** @type {number} */
	#hour;
	/** @type {number} */
	#minute;
	/** @type {number} */
	#second;
	/** @type {number} */
	#millisecond;
	/** @type {number} */
	#dayOfTheWeek;
	/** @type {number} */
	#dayOfTheYear;
	/** @type {number} */
	#daysInMonth;
	/** @type {boolean} */
	#isLegacyDate;
	/** @type {boolean} */
	#isDaylightSavingsTime;
	/** @type {boolean} */
	#isValid;

	/**
	 * Create a new {@link BaseDateTime} instance from a native {@link Date}
	 *
	 * @param {Date} [date=new Date()] The date used to retrieve properties from
	 * @param {boolean} [utc=false] Indicates that the UTC flag should be used when retrieving a property
	 */
	constructor(date = new Date(), utc = false) {
		this.#date = date;
		this.#utc = utc;
	}

	/**
	 * Gets the {@link Date} object.
	 *
	 * @readonly
	 * @returns {Date} The date.
	 */
	get date() {
		return this.#date;
	}

	/**
	 * Get the flag indicating if the date is in UTC mode.
	 *
	 * @readonly
	 * @returns {boolean} `true` if the date is in UTC mode, `false` otherwise.
	 */
	get utc() {
		return this.#utc;
	}

	/**
	 * Get the year.
	 *
	 * @readonly
	 * @returns {number} The year
	 */
	get [DateTimeUnit.YEAR]() {
		return this.#year ??= _get(this.#date, DateField.year, this.#utc);
	}

	/**
	 * Get the month of the year.
	 *
	 * @readonly
	 * @returns {number} The month of the year.
	 */
	get [DateTimeUnit.MONTH]() {
		return this.#month ??= _get(this.#date, DateField.month, this.#utc) + 1;
	}

	/**
	 * Get the day of the month.
	 *
	 * @readonly
	 * @returns {number} The day of the month.
	 */
	get [DateTimeUnit.DAY]() {
		return this.#day ??= _get(this.#date, DateField.day, this.#utc);
	}

	/**
	 * Get the hour of the day.
	 *
	 * @readonly
	 * @returns {number} The hour of the day.
	 */
	get [DateTimeUnit.HOUR]() {
		return this.#hour ??= _get(this.#date, DateField.hour, this.#utc);
	}

	/**
	 * Get the minute of the hour.
	 *
	 * @readonly
	 * @returns {number} The minute of the hour.
	 */
	get [DateTimeUnit.MINUTE]() {
		return this.#minute ??= _get(this.#date, DateField.minute, this.#utc);
	}

	/**
	 * Get the second of the minute.
	 *
	 * @readonly
	 * @returns {number} The second of the minute.
	 */
	get [DateTimeUnit.SECOND]() {
		return this.#second ??= _get(this.#date, DateField.second, this.#utc);
	}

	/**
	 * Get the millisecond of the second.
	 *
	 * @readonly
	 * @returns {number} The millisecond of the second.
	 */
	get [DateTimeUnit.MILLISECOND]() {
		return this.#millisecond ??= _get(this.#date, DateField.millisecond, this.#utc);
	}

	/**
	 * Get the day of the week.
	 *
	 * @readonly
	 * @returns {number} The day of the week.
	 */
	get dayOfTheWeek() {
		return this.#dayOfTheWeek ??= _get(this.#date, DateField.dayOfTheWeek, this.#utc);
	}

	/**
	 * Get the day of the year.
	 * {@see https://stackoverflow.com/a/27790471/230072}
	 *
	 * @readonly
	 * @returns {number} The day of the year.
	 */
	get dayOfTheYear() {
		return this.#dayOfTheYear ??= (this.month - 1) * 31 - (this.month > 1 ? (1054267675 >> this.month * 3 - 6 & 7) - (this.year & 3 || !(this.year % 25) && this.year & 15 ? 0 : 1) : 0) + this.day;
	}

	/**
	 * Get the number of days in the month.
	 * 1. If the month is February, return 28 or 29 depending on whether the year is a leap year.
	 * 2. Otherwise, return 30 or 31 depending on whether the month is September, April, June, or November.
	 *
	 * @readonly
	 * @returns {number} The number of days in the month.
	 */
	get daysInMonth() {
		return this.#daysInMonth ??= this.month === 2 ? this.year & 3 || !(this.year % 25) && this.year & 15 ? 28 : 29 : 30 + (this.month + (this.month >> 3) & 1);
	}

	/**
	 * Get the flag indicating if the date is old and handles timezone offsets differently.
	 *
	 * @readonly
	 * @returns {boolean} `true` if the date is a legacy date, `false` otherwise.
	 */
	get isLegacyDate() {
		return this.#isLegacyDate ??= this.#date.getTimezoneOffset() % 15 !== 0;
	}

	/**
	 * Get the flag indicating if the date is in daylight savings time.
	 *
	 * Let x be the expected number of milliseconds into the year of interest without factoring in daylight savings.
	 * Let y be the number of milliseconds since the Epoch from the start of the year of the date of interest.
	 * Let z be the number of milliseconds since the Epoch of the full date and time of interest
	 * Let t be the subtraction of both x and y from z: z - y - x. This yields the offset due to DST.
	 * If t is zero, then DST is not in effect. If t is not zero, then DST is in effect.
	 *
	 * {@see https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset}
	 *
	 * @readonly
	 * @returns {boolean} `true` if the date is observing DST, `false` otherwise
	 */
	get isDaylightSavingsTime() {
		return this.#isDaylightSavingsTime ??= this.year < 100 ? false : (this.#date.valueOf() - _dateFromArray([this.year, 1, 0]).valueOf() - ((this.dayOfTheYear * 24 * 60 + (this.hour & 0xff) * 60 + (this.minute & 0xff)) | 0) * MillisecondsIn.MINUTES - (this.second & 0xff) * MillisecondsIn.SECONDS - this.millisecond) !== 0;
	}

	/**
	 * Get the flag indicating if the date is valid.
	 * A date is valid if it is not `NaN`.
	 *
	 * @readonly
	 * @example
	 * new BaseDateTime().isValid; // true
	 * new BaseDateTime('foo').isValid; // false
	 * @returns {boolean} `true` if the date is valid, `false` otherwise.
	 */
	get isValid() {
		return this.#isValid ??= !Number.isNaN(this.#date.valueOf());
	}

	/**
	 * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
	 *
	 * @readonly
	 * @returns {number} The number of milliseconds since midnight, January 1, 1970 UTC.
	 */
	valueOf() {
		return this.#date.valueOf();
	}

	/**
	 * A String value that is used in the creation of the default string description of an object.
	 *
	 * @readonly
	 * @returns {string} The default string describing this object
	 */
	get [Symbol.toStringTag]() {
		return 'BaseDateTime';
	}
}