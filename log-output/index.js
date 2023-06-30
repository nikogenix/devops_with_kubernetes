const express = require("express");
const { v4: uuidv4 } = require("uuid");
process.env.NODE_ENV && require("dotenv").config();

const app = express();
const port = process.env.PORT || 3003;

const info = {
	randomString: uuidv4(),
	timestamp: new Date().toISOString(),
};

const output = () => {
	info.timestamp = new Date().toISOString();
	console.log(`${info.timestamp}: ${info.randomString}`);
	setTimeout(output, 5000);
};

output();

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

app.get("/info", (req, res) => {
	res.send(`<h1>${info.timestamp}: ${info.randomString}</h1>`);
});
