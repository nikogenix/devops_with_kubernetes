const express = require("express");
process.env.NODE_ENV && require("dotenv").config();

const app = express();
const port = process.env.PORT || 3005;

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

let ping = 0;

app.get("/pingpong", (req, res) => {
	res.send(`<h1>pong ${ping++}</h1>`);
});
