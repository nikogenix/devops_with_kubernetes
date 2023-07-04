const express = require("express");
process.env.NODE_ENV && require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3005;

let ping = 0;

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

app.use(cors());

app.get("/pingpong", (req, res) => {
	ping++;
	res.send(`<h1>ping-pongs: ${ping}</h1>`);
});

app.get("/", (req, res) => {
	res.send(`${ping}`);
});
