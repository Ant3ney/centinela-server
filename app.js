const express = require('express');
const { google } = require('googleapis');
const app = express();
const eventsRoutes = require('./routes/events');
require('dotenv').config();

app.use('/events', eventsRoutes);

const port = process.env.PORT || 3005;

app.get('/', (req, res) => {
	res.send('Index route');
});

app.listen(port, () => {
	console.log(`App running on http://localhost:${port}`);
});
