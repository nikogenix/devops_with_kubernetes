const express = require("express");
const { v4: uuidv4 } = require("uuid");
process.env.NODE_ENV && require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3006;

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "log.txt");

const getFile = async () =>
	new Promise((res) => {
		fs.readFile(filePath, (err, buffer) => {
			if (err) return console.log(err);
			res(buffer);
		});
	});

let info = "";

const output = async () => {
	info = await getFile();
	console.log(`${info}`);
	setTimeout(output, 5000);
};

output();

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

app.get("/info", (req, res) => {
	res.send(`<h1>${info}</h1>`);
});
