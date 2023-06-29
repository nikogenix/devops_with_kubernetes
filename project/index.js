const express = require("express");
process.env.NODE_ENV && require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.listen(port, () => {
	console.log(`server started in port ${port}`);
});
