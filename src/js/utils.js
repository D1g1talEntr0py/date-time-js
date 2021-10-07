import { Types } from './types.js';

/**
 * 
 * @param {Object} [config]
 * @param {number|Array} config.date
 * @param {boolean} config.utc
 * @param {string} config.type
 * @returns 
 */
 const _nativeDate = ({ date = Date.now(), utc = false , type = Types.NUMBER} = {}) => {
	let nativeDate;

	switch (type) {
		case Types.NUMBER: {
			nativeDate = new Date(date);
			if (utc) {
				nativeDate.setMilliseconds(nativeDate.getMilliseconds() + nativeDate.getTimezoneOffset() * 6e4);
			}
			break;
		}
		case Types.ARRAY: {
			nativeDate = utc ? new Date(Date.UTC(...date)) : new Date(...date);
			break;
		}
		default: nativeDate = new Date(date);
	}

	return nativeDate;
}

export { _nativeDate };