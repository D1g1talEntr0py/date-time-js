export default class Period {
	constructor(field) {
		this._field = field;
	}

	get field() {
		return this._field;
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
}