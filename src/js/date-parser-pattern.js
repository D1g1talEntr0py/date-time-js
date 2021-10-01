import { datePatternTokens, regExps } from './constants.js';

const nonWord = /\W/;

export default class DateParserPattern {
	/**
	 * @param {string} pattern
	 * @param {RegExp} [regExp]
	 */
	constructor(pattern, regExp) {
		if (regExp) {
			this._tokens = pattern.replace(regExps.nonAlpha, '').split('').unique();
			this._regExp = regExp;
		} else {
			const { _tokens, _regExp } = _createFromPattern(pattern);
			this._tokens = _tokens;	
			this._regExp = _regExp;
		}
	}

	static regExpFromPattern(pattern) {
		const { _regExp } = _createFromPattern(pattern);
		return _regExp;
	}

	get tokens() {
		return this._tokens;
	}

	get regExp() {
		return this._regExp;
	}
}

const _createFromPattern = (pattern) => {
	const patternTokens = pattern.split('').filter((/** @type {string} */ elem, /** @type {number} */ index, /** @type {any[]} */ array) => elem.match(nonWord) || array.indexOf(elem) >= index);
	
	let parseRegExp = '';
	for (let index = 0, length = patternTokens.length, token; index < length; index++) {
		token = patternTokens[index];
		parseRegExp += token in datePatternTokens ? datePatternTokens[token].regExp.source : `[${token}]?`;
	}

	return { _tokens: patternTokens.filter((element) => element in datePatternTokens), _regExp: new RegExp(`^${parseRegExp}$`) };
}