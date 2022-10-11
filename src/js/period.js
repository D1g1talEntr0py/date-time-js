import { DateField, periodUnitFields } from './constants.js';
/** @typedef { import('./date-time.js').default } DateTime */

/**
 * Class representation of a Period of time
 *
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class Period {
	#value;
	#unit;
	#field;

	/**
	 * Create a new {@link Period} instance
	 *
	 * @param {number} value
	 * @param {string} unit
	 */
	constructor(value, unit) {
		this.#value = value;
		this.#unit = periodUnitFields[unit];
		this.#field = DateField[this.#unit];
		Object.freeze(this);
	}

	/**
	 *
	 * @returns {number}
	 */
	get value() {
		return this.#value;
	}

	/**
	 *
	 * @returns {string}
	 */
	get unit() {
		return this.#unit;
	}

	/**
	 *
	 * @returns {string}
	 */
	get field() {
		return this.#field;
	}

	/**
	 * Adds specified value to the {@link DateTime} instance
	 *
	 * @param {DateTime} dateTime
	 * @param {number} [value=this.value]
	 * @returns {DateTime} A new instance of {@link DateTime} object with the period value added.
	 */
	add(dateTime, value = this.#value) {
		return dateTime.set(this.#unit, dateTime._baseDateTime[this.#unit] + value);
	}

	/**
	 * Subtracts specified value to the {@link DateTime} instance
	 *
	 * @param {DateTime} dateTime
	 * @param {number} [value=this.value]
	 * @returns {DateTime} A new instance of {@link DateTime} object with the period value subtracted.
	 */
	subtract(dateTime, value = this.#value) {
		return this.add(dateTime, value * -1);
	}

	/**
	 *
	 * @returns {string}
	 */
	get [Symbol.toStringTag]() {
		return 'Period';
	}
}