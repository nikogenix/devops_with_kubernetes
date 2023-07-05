const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const todos = [
	{ task: "create frontend", complete: false },
	{ task: "create backend", complete: true },
];

const typeDefs = gql`
	type Todo {
		task: String!
		complete: Boolean!
	}

	type Query {
		todos: [Todo]
	}

	type Mutation {
		addTodo(task: String!): Todo
	}
`;

const resolvers = {
	Query: {
		todos: () => todos,
	},
	Mutation: {
		addTodo: (root, args, context) => {
			const newTodo = { task: args.task, complete: false };
			todos.push(newTodo);
			return newTodo;
		},
	},
};

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

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

(async function () {
	await server.start();
	server.applyMiddleware({ app, path: "/api" });
})();

app.get("/image.jpg", async (req, res) => {
	const currentRequest = new Date().toDateString();

	fs.readFile(filePath, async (err, data) => {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}

		res.set("Content-disposition", "attachment; filename=image.jpg");
		res.set("Content-type", "image/jpeg");
		res.send(data);

		if (lastRequest !== currentRequest) {
			lastRequest = currentRequest;
			await removeFile();
			await findAFile();
		}
	});
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`server ready at http://localhost:${port}/api`);
});
