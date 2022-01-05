import DateParserPattern from './date-parser-pattern.js';
import { i18n, _formatTimeZone } from './constants.js';

export default class Locale {
	constructor({ name, patterns, parsingRegExp, dayNames, monthNames }) {
		this._name = name;
		this._timeZone = {
			city: new Intl.DateTimeFormat(name).resolvedOptions().timeZone,
			name: {	[i18n.timeZoneFormats.SHORT]: {}, [i18n.timeZoneFormats.LONG]: {}	}
		};
		this._patterns = patterns;
		this._dateParserPattern = new DateParserPattern(patterns.LOCALE_DATE_TIME, parsingRegExp);
		this._dayNames = dayNames;
		this._monthNames = monthNames;

		const _epochDate = new Date(1970, 0, 1);
		for (let month = 1; month < 12; month++) {
			for (const timezoneFormat of Object.values(i18n.timeZoneFormats)) {
				if (!this._timeZone.name[timezoneFormat][_epochDate.getTimezoneOffset()]) {
					this._timeZone.name[timezoneFormat][_epochDate.getTimezoneOffset()] = _formatTimeZone(_epochDate, timezoneFormat, name);
				}
			}
			_epochDate.setMonth(month);
		}
	}

	get name() {
		return this._name;
	}

	get timeZone() {
		return this._timeZone;
	}

	get patterns() {
		return this._patterns;
	}

	get dateParserPattern() {
		return this._dateParserPattern;
	}

	get dayNames() {
		return this._dayNames;
	}

	get monthNames() {
		return this._monthNames;
	}
}