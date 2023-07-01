const express = require("express");
process.env.NODE_ENV && require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3001;

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "image.jpg");

const fileAlreadyExists = async () =>
	new Promise((res) => {
		fs.stat(filePath, (err, stats) => {
			if (err || !stats) return res(false);
			return res(true);
		});
	});

const findAFile = async () => {
	if (await fileAlreadyExists()) return;

	await new Promise((res) => fs.mkdir(directory, (err) => res()));
	const response = await axios.get("https://picsum.photos/300", { responseType: "stream" });
	response.data.pipe(fs.createWriteStream(filePath));
};

const removeFile = async () => new Promise((res) => fs.unlink(filePath, (err) => res()));

let lastRequest = new Date().toDateString();
findAFile();

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

app.get("/", async (req, res) => {
	const currentRequest = new Date().toDateString();

	if (lastRequest !== currentRequest) {
		lastRequest = currentRequest;
		await removeFile();
		await findAFile();
	}

	res.send(`<h1>hello kube</h1><img src="/image.jpg">`);
});

app.get("/image.jpg", (req, res) => {
	fs.readFile(filePath, (err, data) => {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}

		res.set("Content-disposition", "attachment; filename=image.jpg");
		res.set("Content-type", "image/jpeg");
		res.send(data);
	});
});
