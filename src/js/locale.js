import DateParserPattern from './date-parser-pattern.js';

export default class Locale {
	constructor({ name, patterns, parsingRegExp, dayNames, monthNames }) {
		this._name = name;
		this._patterns = patterns;
		this._dateParsingPattern = new DateParserPattern(patterns.LOCALE_DATE_TIME, parsingRegExp);
		this._dayNames = dayNames;
		this._monthNames = monthNames;
	}

	get name() {
		return this._name;
	}

	get patterns() {
		return this._patterns;
	}

	get dateParsingPattern() {
		return this._dateParsingPattern;
	}

	get dayNames() {
		return this._dayNames;
	}

	get monthNames() {
		return this._monthNames;
	}
}