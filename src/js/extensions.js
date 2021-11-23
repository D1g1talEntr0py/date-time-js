// Array.prototype extensions
Object.defineProperties(Array.prototype, {
	unique: {
		/**
		 * Returns a new array of unique values
		 *
		 * @this Array
		 * @memberof Array.prototype
		 * @returns {Array<*>}
		 */
		value: function() {
			return this.filter((element, index, array) => array.indexOf(element) >= index);
		}
	}
});

// String.prototype extensions
Object.defineProperties(String.prototype, {
	splice: {
		/**
		 * Inserts a character at a specific index
		 *
		 * @this String
		 * @memberof String.prototype
		 * @param {number} start
		 * @param  {...any} chars
		 * @returns {string}
		 */
		value: function(start, ...chars) {
			const charArray = Array.from(this);
			charArray.splice(start, 0, chars);
			return charArray.join('');
		}
	}
});