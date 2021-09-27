class Type {
	static isObject() {}
	static isArray() {}
	static isString() {}
	static isDate() {}
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
		return _type(object);
	}
}

class Types {
	static OBJECT = 'Object';
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

const _type = (object) => Object.prototype.toString.call(object).slice(8, -1);

Object.values(Types).forEach(function(type) {
	Object.defineProperty(Type, 'is' + type, {
		value: (object) => _type(object) == type
	});
});

export { Type, Types };