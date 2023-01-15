const express = require("express");
const { google } = require("googleapis");
const app = express();
const eventsRoutes = require("./routes/events");
require("dotenv").config();
let cors = require("cors");

let whitelist = [
  "",
  "http://localhost:3000",
  "https://centinelabible.org",
  "https://www.centinelabible.org",
];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/events", eventsRoutes);
const port = process.env.PORT || 3005;

app.get("/", (req, res) => {
  res.send("Index route");
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
