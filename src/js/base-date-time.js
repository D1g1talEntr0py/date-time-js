import { _dateFromArray, _get } from './utils.js';
import { DateField, DateTimeUnit, MillisecondsIn } from './constants.js';

/**
 * BaseDateTime - A class to hold the basic properties of a date
 *
 * @module BaseDateTime
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
	 *
	 * @param {Date} [date = new Date()]
	 * @param {boolean} [utc = false]
	 */
	constructor(date = new Date(), utc = false) {
		this.#date = date;
		this.#utc = utc;
	}

	/**
	 *
	 * @returns {Date}
	 */
	get date() {
		return this.#date;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	get utc() {
		return this.#utc;
	}

	/**
	 *
	 * @returns {number}
	 */
	get [DateTimeUnit.YEAR]() {
		return this.#year ??= _get(this.#date, DateField.year, this.#utc);
	}

	/**
	 *
	 * @returns {number}
	 */
	get [DateTimeUnit.MONTH]() {
		return this.#month ??= _get(this.#date, DateField.month, this.#utc) + 1;
	}

	/**
	 *
	 * @returns {number}
	 */
	get [DateTimeUnit.DAY]() {
		return this.#day ??= _get(this.#date, DateField.day, this.#utc);
	}

	/**
	 *
	 * @returns {number}
	 */
	get [DateTimeUnit.HOUR]() {
		return this.#hour ??= _get(this.#date, DateField.hour, this.#utc);
	}

	/**
	 *
	 * @returns {number}
	 */
	get [DateTimeUnit.MINUTE]() {
		return this.#minute ??= _get(this.#date, DateField.minute, this.#utc);
	}

	/**
	 *
	 * @returns {number}
	 */
	get [DateTimeUnit.SECOND]() {
		return this.#second ??= _get(this.#date, DateField.second, this.#utc);
	}

	/**
	 *
	 * @returns {number}
	 */
	get [DateTimeUnit.MILLISECOND]() {
		return this.#millisecond ??= _get(this.#date, DateField.millisecond, this.#utc);
	}

	/**
	 * Get the day of the week
	 *
	 * @returns {number}
	 */
	get dayOfTheWeek() {
		return this.#dayOfTheWeek ??= _get(this.#date, DateField.dayOfTheWeek, this.#utc);
	}

	/**
	 *
	 * {@see https://stackoverflow.com/a/27790471/230072}
	 *
	 * @returns {number}
	 */
	get dayOfTheYear() {
		return this.#dayOfTheYear ??= (this.month - 1) * 31 - (this.month > 1 ? (1054267675 >> this.month * 3 - 6 & 7) - (this.year & 3 || !(this.year % 25) && this.year & 15 ? 0 : 1) : 0) + this.day;
	}

	/**
	 *
	 * @returns {number}
	 */
	get daysInMonth() {
		return this.#daysInMonth ??= this.month === 2 ? this.year & 3 || !(this.year % 25) && this.year & 15 ? 28 : 29 : 30 + (this.month + (this.month >> 3) & 1);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	get isLegacyDate() {
		return this.#isLegacyDate ??= this.#date.getTimezoneOffset() % 15 !== 0;
	}

	/**
	 *
	 * Let x be the expected number of milliseconds into the year of interest without factoring in daylight savings.
	 * Let y be the number of milliseconds since the Epoch from the start of the year of the date of interest.
	 * Let z be the number of milliseconds since the Epoch of the full date and time of interest
	 * Let t be the subtraction of both x and y from z: z - y - x. This yields the offset due to DST.
	 * If t is zero, then DST is not in effect. If t is not zero, then DST is in effect.
	 *
	 * {@see https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset}
	 *
	 * @returns {boolean} `true` if the date is observing DST, `false` otherwise
	 */
	get isDaylightSavingsTime() {
		return this.#isDaylightSavingsTime ??= this.year < 100 ? false : (this.#date.valueOf() - _dateFromArray([this.year, 1, 0]).valueOf() - ((this.dayOfTheYear * 24 * 60 + (this.hour & 0xff) * 60 + (this.minute & 0xff)) | 0) * MillisecondsIn.MINUTES - (this.second & 0xff) * MillisecondsIn.SECONDS - this.millisecond) !== 0;
	}

	get isValid() {
		return this.#isValid ??= !Number.isNaN(this.#date.valueOf());
	}

	/**
	 *
	 * @returns {number}
	 */
	valueOf() {
		return this.#date.valueOf();
	}

	/**
	 *
	 * @returns {string}
	 */
	get [Symbol.toStringTag]() {
		return 'BaseDateTime';
	}
}