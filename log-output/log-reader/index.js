const express = require("express");
process.env.NODE_ENV && require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

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

const getPing = async () => {
	const response = await axios.get("http://ping-pong-svc:3011");
	return response.data;
};
let info = "";
let ping = "";

const output = async () => {
	info = await getFile();
	ping = await getPing();
	console.log(info, ping);
	setTimeout(output, 5000);
};

output();

app.use(express.json());

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

app.get("/info", (req, res) => {
	res.send(`
	<h1>${process.env.TEXT}</h1>
	<h1>${info}</h1>
	<h1>ping/pongs: ${ping}</h1>
	`);
});
