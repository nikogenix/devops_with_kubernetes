const axios = require("axios");
const mongoose = require("mongoose");
const db = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(db);

const todoSchema = new mongoose.Schema({
	task: String,
	complete: Boolean,
});

const TodoModel = mongoose.model("Todo", todoSchema);

mongoose.connection.on("connected", async () => {
	try {
		const today = new Date();
		const formattedDate = today.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});

		const wikiRequest = await axios.get("https://en.wikipedia.org/wiki/Special:Random");
		const url = wikiRequest.request.res.responseUrl;

		const newTodo = await TodoModel.create({
			task: `${formattedDate}: read ${url}`,
			complete: false,
		});
	} catch (error) {
		console.error(error);
	} finally {
		mongoose.connection.close();
	}
});
