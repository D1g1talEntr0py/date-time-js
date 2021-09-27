export default class Locale {
	constructor({ name, patterns, parsingRegExp, dayNames, monthNames }) {
		this._name = name;
		this._patterns = patterns;
		this._parsingRegExp = parsingRegExp;
		this._dayNames = dayNames;
		this._monthNames = monthNames;
	}

	get name() {
		return this._name;
	}

	get patterns() {
		return this._patterns;
	}

	get parsingRegExp() {
		return this._parsingRegExp;
	}

	get dayNames() {
		return this._dayNames;
	}

	get monthNames() {
		return this._monthNames;
	}
}