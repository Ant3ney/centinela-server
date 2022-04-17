const express = require('express');
const { eventUtils } = require('../utilities');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('Events index route');
});
router.get('/:eventID', async (req, res) => {
	//TODO: When needed, make the eventID determine what event context gets returned
	const allEvents = await eventUtils.getCalenderEvents();
	const liveEvent = await eventUtils.getLiveData(allEvents);
	const liveTill = liveEvent ? liveEvent.titlizedEndDateObj : null;

	res.status(200).json({ allEvents, liveEvent, liveTill });
});

module.exports = router;
