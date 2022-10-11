const _isObject = (obj) => obj !== null && typeof obj === 'object';
const _isPlainObject = (obj) => _isObject(obj) && (obj.constructor === Object || obj.constructor === undefined) && Object.prototype.toString.call(obj).slice(8, -1) == 'Object';

const _merge = (target, ...sources) => {
	for (const source of sources) {
		if (!_isPlainObject(source) || !_isPlainObject(target)) { return; }

		// Copy source's own properties into target's own properties
		const _copyProperty = (property) => {
			const descriptor = Object.getOwnPropertyDescriptor(source, property);
			if (descriptor.enumerable) {
				// Copy in-depth first
				if (_isPlainObject(source[property]) && _isPlainObject(target[property])) {
					descriptor.value = _merge(target[property], source[property]);
				}

				target[property] = descriptor.value; // shallow copy value only
			}
		};

		// Copy string-keyed properties
		for (const property of Object.getOwnPropertyNames(source)) {
			_copyProperty(property);
		}
	}

	return target;
};

export { _isObject, _isPlainObject, _merge };