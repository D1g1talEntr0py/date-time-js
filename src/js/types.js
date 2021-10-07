import defineProperties from './extensions.js';

class Type {
	static isObject() {}
	static isArray() {}
	static isString() {}
	static isDate() {}
	static isDateTime() {}
	static isRegExp() {}
	static isFunction() {}
	static isBoolean() {}
	static isNumber() {}
	static isNull() {}
	static isUndefined() {}
	
	/**
	 * @memberOf Type
	 * @param {Object} object
	 * @returns {string}
	 */
	static of(object) {
		return Object.prototype.toString.call(object).slice(8, -1);
	}
}

class Types {
	static OBJECT = 'Object';
	static ARRAY = 'Array';
	static STRING = 'String';
	static DATE = 'Date';
	static DATE_TIME = 'DateTime';
	static REG_EXP = 'RegExp';
	static FUNCTION = 'Function';
	static BOOLEAN = 'Boolean';
	static NUMBER = 'Number';
	static NULL = 'Null';
	static UNDEFINED = 'Undefined';
}

defineProperties(Type, Object.values(Types).map((type) => ({ [`is${type}`]: (object) => Type.of(object) == type })));

export { Type, Types };