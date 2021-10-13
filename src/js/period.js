import { Type, Types } from './types.js';
export default class Period {
	/**
	 *
	 * @param {string} field
	 * @param {number} [value]
	 */
	constructor(field, value) {
		this._field = field;
		this._value = value;
	}

	get field() {
		return this._field;
	}

	set value(value) {
		this._value = value;
	}

	get value() {
		return this._value;
	}

	/**
	 *
	 * @param {DateTime} dateTime
	 * @param {number} value
	 * @returns {DateTime}
	 */
	add(dateTime, value) {
		return dateTime.set(this.field, dateTime.get(this.field) + value, dateTime.isUtc());
	}

	/**
	 *
	 * @param {DateTime} dateTime
	 * @param {number} value
	 * @returns {DateTime}
	 */
	subtract(dateTime, value) {
		return this.add(dateTime, value * -1);
	}

	toString() {
		const [ name ] = Object.keys(this._field);
		return name;
	}

	get [Symbol.toStringTag]() {
    return Period.name;
  }
}

Type.isPeriod = (object) => object instanceof Period;
Types.PERIOD = Period.name;