class Type {
	static isArray(object) {
		return Array.isArray(object);
	}

	static isString(object) {
		return typeof(object) == 'string';
	}

	static isDate(object) {
		return object instanceof Date;
	}

	static isRegExp(object) {
		return object instanceof RegExp;
	}

	static isFunction(object) {
		return typeof(object) == 'function';
	}

	static isBoolean(object) {
		return typeof(object) == 'boolean';
	}

	static isNumber(object) {
		return typeof(object) == 'number';
	}

	static isNull(object) {
		return object === null;
	}

	static isUndefined(object) {
		return typeof(object) == 'undefined';
	}

	static isObject(object) {
		return typeof(object) == 'object';
	}

	/**
	 * @memberOf Type
	 * @param {Object} object
	 * @returns {string}
	 */
	static of(object) {
		for (const type of Object.values(Types)) {
			if (Type[`is${type}`](object)) {
				return type;
			}
		}
		return undefined;
	}
}

class Types {
	static ARRAY = 'Array';
	static STRING = 'String';
	static DATE = 'Date';
	static REG_EXP = 'RegExp';
	static FUNCTION = 'Function';
	static BOOLEAN = 'Boolean';
	static NUMBER = 'Number';
	static NULL = 'Null';
	static UNDEFINED = 'Undefined';
}

export { Type, Types };