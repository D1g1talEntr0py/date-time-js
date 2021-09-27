import DateTime from './date-time.js';
import { Type } from './types.js';

export default class Duration {
	constructor({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = {}) {
		if (Type.isNumber(...arguments)) {
			let [ value ] = [ ...arguments ];
			this._total = value;
			this._milliseconds = value % 1e3;
			value = Math.floor(value / 1e3);
			this._seconds = value % 60;
			value = Math.floor(value / 60);
			this._minutes = value % 60;
			value = Math.floor(value / 60);
			this._hours = value % 24;
			value = Math.floor(value / 24);
			this._days = value % 365;
			value = Math.floor(value / 365);
			this._years = value;
		} else if (arguments.length == 2 && arguments[0] instanceof DateTime && arguments[1] instanceof DateTime) {
			const [ startDate, endDate ] = [ ...arguments ];
			this._total = endDate - startDate;
			this._years = endDate.getYear() - startDate.getYear();
			this._months = endDate.getMonth() - startDate.getMonth();
			this._days = endDate.getDay() - startDate.getDay();
			this._hours = endDate.getHours() - startDate.getHours();
			this._minutes = endDate.getMinutes() - startDate.getMinutes();
			this._seconds = endDate.getSeconds() - startDate.getSeconds();
			this._milliseconds = endDate.getMilliseconds() - startDate.getMilliseconds();

			if (this._milliseconds < 0) {
				this._seconds--;
				this._milliseconds += 1000;
			}

			if (this._seconds < 0) {
				this._minutes--;
				this._seconds += 60;
			}

			if (this._minutes < 0) {
				this._hours--;
				this._minutes += 60;
			}

			if (this._hours < 0) {
				this._days--;
				this._hours += 24;
			}

			if (this._days < 0) {
				this._months--;
				this._days = startDate.getDaysInMonth() - startDate.getDay() + endDate.getDay() - 1;
			}

			if (this._months < 0) {
				this._years--;
				this._months += 12;
			}
		} else {
			this._years = years;
			this._months = months;
			this._days = days;
			this._hours = hours;
			this._minutes = minutes;
			this._seconds = seconds;
			this._milliseconds = milliseconds;
			this._total = milliseconds + seconds * 1e3 + minutes * 6e4 + hours * 3.6e6 + days * 8.64e7 + months * 2.628e9 + years * 3.1556952e10;
		}
	}

	get years() {
		return this._years;
	}

	get months() {
		return this._months;
	}

	get days() {
		return this._days;
	}

	get hours() {
		return this._hours;
	}

	get minutes() {
		return this._minutes;
	}

	get seconds() {
		return this._seconds;
	}

	get milliseconds() {
		return this._milliseconds;
	}

	asYears() {
		return this._years;
	}

	asMonths() {
		return this._months + this._years * 12;
	}

	asWeeks() {
		return Math.floor(this._total / 6.048e8);
	}

	asDays() {
		return Math.floor(this._total / 8.64e7);
	}

	asHours() {
		return Math.floor(this._total / 3.6e6);
	}

	asMinutes() {
		return Math.floor(this._total / 6e4);
	}

	asSeconds() {
		return Math.floor(this._total / 1e3);
	}

	asMilliseconds() {
		return this._total;
	}

	asObject() {
		return { years: this._years, months: this._months, days: this._days, hours: this._hours, minutes: this._minutes, seconds: this._seconds, milliseconds: this._milliseconds };
	}
}