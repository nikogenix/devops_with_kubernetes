const express = require("express");
const { v4: uuidv4 } = require("uuid");
process.env.NODE_ENV && require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3006;

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "log.txt");
const pingFilePath = path.join(directory, "ping.txt");

const getFile = async () =>
	new Promise((res) => {
		fs.readFile(filePath, (err, buffer) => {
			if (err) return console.log(err);
			res(buffer);
		});
	});

const getPingFile = async () =>
	new Promise((res) => {
		fs.readFile(pingFilePath, (err, buffer) => {
			if (err) return console.log(err);
			res(buffer);
		});
	});

let info = "";
let ping = "";

const output = async () => {
	info = await getFile();
	ping = await getPingFile();
	console.log(info, ping);
	setTimeout(output, 5000);
};

output();

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

app.get("/info", (req, res) => {
	res.send(`<h1>${info}</h1><h1>${[ping]}</h1>`);
});
