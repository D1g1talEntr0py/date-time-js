import Locale from '../locale.js';
import { i18n } from '../constants.js';

const { locale, global } = Object.fromEntries(new URL(import.meta.url).searchParams);

await Locale.import(locale ?? i18n.defaultLocale, !locale || global == 'true');

export { Locale };
export { default as DateTime } from '../date-time.js';
export { default as Duration } from '../duration.js';
export { default as Period } from '../period.js';