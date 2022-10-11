export default {
	name: 'zh-TW',
	patternTokens: {
		D: 'YYYY/MM/DD',
		T: 'HH:mm',
		TS: 'HH:mm:ss',
		DD: 'YYYY年M月D日',
		DDD: 'YYYY年M月D日dddd',
		d: 'YYYY/M/D',
		dd: 'YYYY年M月D日',
		ddd: 'YYYY年M月D日dddd'
	},
	ordinal: (day) => `${day}日`,
	dayNames: [
		'週日', '週一', '週二', '週三', '週四', '週五', '週六',
		'星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'
	],
	monthNames: [
		'1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月',
		'一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
	]
};