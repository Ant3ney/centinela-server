const { google } = require('googleapis');
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
eventUtils = {
	getCalenderEvents: async () => {
		const calendar = google.calendar({
			version: 'v3',
			auth: process.env.API_KEY,
		});
		return new Promise((resolve, reject) => {
			calendar.events
				.list({ calendarId: process.env.CALENDAR_ID, timeMin: new Date() })
				.then(res => {
					if (!res || !res.data || !res.data.items) {
						return reject({ message: 'Failded to properly the query google calander API' });
					}
					return resolve(
						res.data.items.map(item => {
							return {
								title: item.summary,
								description: item.description,
								startDate: item.start.dateTime,
								formatedStartDate: eventUtils.titlizeDateString(item.start.dateTime).title,
								titlizedStartDateObj: eventUtils.titlizeDateString(item.start.dateTime),
								endDate: item.end.dateTime,
								formatedEndDate: eventUtils.titlizeDateString(item.end.dateTime).title,
								titlizedEndDateObj: eventUtils.titlizeDateString(item.end.dateTime),
								item,
							};
						})
					);
				})
				.catch(reject);
		});
	},
	titlizeDateString: dateString => {
		if (!dateString) {
			console.error('Passed in undefinded date string to function "titlizeDateString"');
		}
		const dateObj = new Date(dateString);
		const rawHour = dateObj.getHours();
		const hourObj = (() => {
			if (rawHour - 12 > 0) {
				return { hour: rawHour - 12, ampm: 'pm' };
			} else if (rawHour === 0) {
				return { hour: 12, ampm: 'am' };
			}
			return { hour: rawHour, ampm: 'am' };
		})();
		const month = months[dateObj.getMonth()];
		const date = dateObj.getDate();
		const year = dateObj.getFullYear();
		const day = days[dateObj.getDay()];
		const minute = dateObj.getMinutes();
		const { hour, ampm } = hourObj;
		const titlizedDateObj = {
			month,
			date,
			year,
			day,
			hour,
			minute,
			ampm,
			rawHour,
			dateString,
			title: `${day} ${month} ${date}, ${year}`,
		};
		return titlizedDateObj;
	},
	getLiveData: async events => {
		events = events || (await eventUtils.getCalenderEvents());
		return (() => {
			for (let i = 0; i < events.length; i++) {
				const currentEvent = events[i];
				const currentItem = currentEvent.item;
				if (eventUtils.isEventItemLive(currentItem)) {
					return currentEvent;
				}
			}
			return false;
		})();
	},
	isEventItemLive: item => {
		//#region Item Validation
		if (!item || !item.start || !item.start.dateTime || !item.end || !item.end.dateTime) {
			return false;
		}
		//#endregion
		const startDate = new Date(item.start.dateTime);
		const endDate = new Date(item.end.dateTime);
		const currentTime = new Date();
		if (startDate < currentTime && endDate > currentTime) {
			return true;
		}
		return false;
	},
};
module.exports = eventUtils;
