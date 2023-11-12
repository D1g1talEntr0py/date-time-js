import { DateField, periodUnitFields } from './constants.js';

/** @typedef { import('./date-time.js').default } DateTime */

/**
 * Class representation of a Period of time
 *
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
 */
export default class Period {
	/** @type {number} */
	#value;
	/** @type {string} */
	#unit;
	/** @type {string} */
	#field;

	/**
	 * Create a new {@link Period} instance.
	 *
	 * @param {number} value The value of the period.
	 * @param {string} unit The unit of the period.
	 */
	constructor(value, unit) {
		this.#value = value;
		this.#unit = periodUnitFields[unit];
		this.#field = DateField[this.#unit];
		Object.freeze(this);
	}

	/**
	 * Gets the value of the period.
	 *
	 * @readonly
	 * @returns {number} The value of the period.
	 */
	get value() {
		return this.#value;
	}

	/**
	 * Gets the unit of the period.
	 *
	 * @readonly
	 * @returns {string} The unit of the period.
	 */
	get unit() {
		return this.#unit;
	}

	/**
	 * Gets the field of the period.
	 *
	 * @readonly
	 * @returns {string} The field of the period.
	 */
	get field() {
		return this.#field;
	}

	/**
	 * Adds specified value to the {@link DateTime} instance
	 *
	 * @param {DateTime} dateTime The {@link DateTime} instance.
	 * @param {number} [value=this.value] The value to add.
	 * @returns {DateTime} A new instance of {@link DateTime} object with the period value added.
	 */
	add(dateTime, value = this.#value) {
		return dateTime.set(this.#unit, dateTime.get(this.#unit) + value);
	}

	/**
	 * Subtracts specified value to the {@link DateTime} instance
	 *
	 * @param {DateTime} dateTime The {@link DateTime} instance.
	 * @param {number} [value=this.value] The value to subtract.
	 * @returns {DateTime} A new instance of {@link DateTime} object with the period value subtracted.
	 */
	subtract(dateTime, value = this.#value) {
		return this.add(dateTime, value * -1);
	}

	/**
	 * Returns the name of the object's type.
	 *
	 * @returns {string} The name of the object's type.
	 */
	get [Symbol.toStringTag]() {
		return 'Period';
	}
}