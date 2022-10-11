import DateTime from '../src/js/date-time.js';
import Locale from '../src/js/locale.js';
import Period from '../src/js/period.js';
import Duration from '../src/js/duration.js';

const { locale = 'en-US', global = 'true' } = Object.fromEntries(new URL(import.meta.url).searchParams);

await Locale.import(locale, global == 'true');

export { DateTime, Locale, Period, Duration };