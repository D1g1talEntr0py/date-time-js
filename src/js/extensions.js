/**
 * Defines properties of an Object using Object.defineProperty if the browser supports it.
 * This is used to keep from having to add the function directly to the prototype of the Object
 *
 * @param {Object} object - The Object to add properties to
 * @param {Object} properties - The properties to add to the Object
 * @param {boolean} [override]
 */
 const defineProperties = (object, properties, override = false) => {
	Object.keys(properties).forEach((name) => {
		if (!override && name in object) { return }

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			writable: true,
			value: properties[name]
		});
	});
}

(() => {
	// Array.prototype extensions
	defineProperties(Array.prototype, {
		/**
		 * Returns a new array of unique values
		 *
		 * @returns {Array<*>}
		 */
		unique: function() {
			return this.filter((element, index, array) => array.indexOf(element) >= index);
		}
	});

	// String.prototype
	defineProperties(String.prototype, {
		/**
		 * 
		 * @memberof String.prototype
		 * @param {number} start 
		 * @param  {...string} chars 
		 * @returns {string}
		 */
		splice: function(start, ...chars) {
			const pair = Array.from(this);
			pair.splice(start, 0, chars);
			return pair.join('');
		}
	});
})();

export default defineProperties;