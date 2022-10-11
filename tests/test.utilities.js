import { expect } from '@jest/globals';
import { DateTime } from './module.js?locale=en-US&global=true';
import { _dateFromArray, _get } from '../src/js/utils.js';

/**
 * Checks that the properties of a {@link Date} object match the properties of a {@link DateTime} object
 *
 * @param {string} description
 * @param {DateTime} dateTime
 * @param {Date} date
 */
const _checkDateProperties = (description, dateTime, date) => {
	console.debug(`Checking DateTime: ${dateTime.toLocaleString()} properties against Date: ${date.toLocaleString()} for ${description}`);
	expect(dateTime.toDate().toString()).not.toBe('Invalid Date');
	expect(dateTime.getYear()).toBe(_get(date, 'FullYear', dateTime.isUtc()));
	// Native JavaScript Date uses 0-based months. ლ(ಠ益ಠლ)
	expect(dateTime.getMonth()).toBe(_get(date, 'Month', dateTime.isUtc()) + 1);
	expect(dateTime.getDay()).toBe(_get(date, 'Date', dateTime.isUtc()));
	expect(dateTime.getHour()).toBe(_get(date, 'Hours', dateTime.isUtc()));
	expect(dateTime.getMinute()).toBe(_get(date, 'Minutes', dateTime.isUtc()));
	expect(dateTime.getSecond()).toBe(_get(date, 'Seconds', dateTime.isUtc()));
	expect(dateTime.getMillisecond()).toBe(_get(date, 'Milliseconds', dateTime.isUtc()));
};

/**
 * Creates new {@link Date} and {@link DateTime} objects and returns them in an {@link Object}
 *
 * @param {Array<number>} dateValues
 * @param {boolean} [utc=false]
 * @returns {{date: Date, dateTime: DateTime}}
 */
const _createDatesFromArray = (dateValues, utc = false) => ({ date: _dateFromArray(dateValues, utc), dateTime: new DateTime(dateValues, { utc }) });

/**
 * Create a {@link Date} instance as UTC.
 *
 * @returns {Date}
 */
const _createCurrentUtcDate = () => {
	const date = new Date();

	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
};

/**
 * Calculates the day of the year from the provided {@link Date} object.
 *
 * @param {Date} date
 * @returns {number}
 */
// const _calculateDayOfYear = (date) => {
//   const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
//   const month = date.getMonth();
//   const day = date.getDate();
//   let dayOfYear = dayCount[month] + day;

//   if (month > 1 && _isLeapYear(date.getFullYear())) {
//     dayOfYear++;
//   }

//   return dayOfYear;
// };

/**
 * Determines if the date is in Daylight Savings Time
 *
 * @param {Date} date
 * @returns {boolean}
 */
const _isDST = (date) => {
	const year = date.getFullYear();
	const monthsTestOrder = [ 6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1 ];
	let standardTimeOffset = _dateFromArray([year, 1, 1]).getTimezoneOffset();

	for (let month = 1; month <= 12; month++) {
		let offset = _dateFromArray([year, monthsTestOrder[month], 1]).getTimezoneOffset();
		if (offset != standardTimeOffset) {
			standardTimeOffset = Math.max(standardTimeOffset, offset);
			break;
		}
	}

	return date.getTimezoneOffset() < standardTimeOffset;
};

export { _checkDateProperties, _createDatesFromArray, _createCurrentUtcDate, _isDST };