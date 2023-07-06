const express = require("express");
process.env.NODE_ENV && require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3005;

const { Client } = require("pg");

let client = new Client({
	connectionString: process.env.DB_URL,
});

async function connectDb() {
	while (true) {
		const tempClient = new Client({
			connectionString: process.env.DB_URL,
		});

		try {
			await tempClient.connect();
			console.log("connected to the DB");
			client = tempClient;
			break;
		} catch (error) {
			console.error(error.message);
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
}

async function checkAndIncrementPing() {
	try {
		const tableExists = await client.query(
			`SELECT EXISTS (
				SELECT 1
				FROM information_schema.tables
				WHERE table_schema = 'public'
				AND table_name = 'ping_table'
      		);`
		);

		if (!tableExists.rows[0].exists) {
			await client.query(
				`CREATE TABLE ping_table (
					ping INT
				);`
			);

			await client.query("INSERT INTO ping_table (ping) VALUES (1)");
			return 1;
		}

		await client.query("UPDATE ping_table SET ping = ping + 1");
		const result = await client.query("SELECT ping FROM ping_table LIMIT 1");
		const ping = result.rows[0].ping;
		return ping;
	} catch (error) {
		console.error(error.message);
	}
}

async function checkPing() {
	try {
		const tableExists = await client.query(
			`SELECT EXISTS (
				SELECT 1
				FROM information_schema.tables
				WHERE table_schema = 'public'
				AND table_name = 'ping_table'
      		);`
		);

		if (!tableExists.rows[0].exists) {
			await client.query(
				`CREATE TABLE ping_table (
					ping INT
				);`
			);

			await client.query("INSERT INTO ping_table (ping) VALUES (1)");
			return 1;
		}

		const result = await client.query("SELECT ping FROM ping_table LIMIT 1");
		const ping = result.rows[0].ping;
		return ping;
	} catch (error) {
		console.error(error.message);
	}
}

connectDb();

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}/`);
});

app.use(cors());

app.get("/pingpong", async (req, res) => {
	try {
		const ping = await checkAndIncrementPing();
		res.send(`<h1>ping-pongs: ${ping}</h1>`);
	} catch (error) {
		console.error(error);
		res.status(500).send("DB error");
	}
});

app.get("/", async (req, res) => {
	try {
		const ping = await checkPing();
		res.send(`${ping}`);
	} catch (error) {
		console.error(error);
		res.status(500).send("DB error");
	}
});
