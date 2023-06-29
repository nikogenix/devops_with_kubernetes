const { v4: uuidv4 } = require("uuid");

const randomString = uuidv4();

const output = () => {
	const timestamp = new Date().toISOString();
	console.log(`${timestamp}: ${randomString}`);
	setInterval(output, 5000);
};

output();
