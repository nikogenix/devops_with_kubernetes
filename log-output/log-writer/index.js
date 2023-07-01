const express = require("express");
const { v4: uuidv4 } = require("uuid");
process.env.NODE_ENV && require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3003;

const info = {
	randomString: uuidv4(),
	timestamp: new Date().toISOString(),
};

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "log.txt");

const fileAlreadyExists = async () =>
	new Promise((res) => {
		fs.stat(directory, (err, stats) => {
			if (err || !stats) return res(false);
			return res(true);
		});
	});

const output = async () => {
	info.timestamp = new Date().toISOString();

	if (!(await fileAlreadyExists())) {
		await new Promise((res) => fs.mkdir(directory, (err) => console.log(err)));
	}

	fs.writeFile(filePath, `${info.timestamp}: ${info.randomString}`, (err) => err && console.log(err));

	setTimeout(output, 5000);
};

output();

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});
