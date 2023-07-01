const express = require("express");
process.env.NODE_ENV && require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3005;

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "ping.txt");

const fileAlreadyExists = async () =>
	new Promise((res) => {
		fs.stat(directory, (err, stats) => {
			if (err || !stats) return res(false);
			return res(true);
		});
	});

const output = async (ping) => {
	if (!(await fileAlreadyExists())) {
		await new Promise((res) => fs.mkdir(directory, (err) => console.log(err)));
	}

	fs.writeFile(filePath, `ping-pongs: ${ping}`, (err) => err && console.log(err));
};

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

let ping = 0;
output(ping);

app.get("/pingpong", (req, res) => {
	ping++;
	output(ping);
	res.send(`<h1>ping-pongs: ${ping}</h1>`);
});
