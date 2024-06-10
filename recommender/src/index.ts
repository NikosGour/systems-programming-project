import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import express_winston from "express-winston";
import { UUID, UUIDError } from "../../systems_programming_lib/bin/functionality/uuid.js";
import { DummyRecommendationEngine, Recommender, RecommenderError } from "./functionality/recommender.js";
import getLogger from "../../systems_programming_lib/bin/logger.js";
import { Event, isEvent } from "../../systems_programming_lib/bin/models/event.js";
import mysql2 from "mysql2/promise";
import { SportRecommenderEngine } from "./functionality/sport_recommender.js";
import { MySQLDatabaseClient } from "./database/utils_database.js";

dotenv.config();
const logger = getLogger(`index.logs`);

const app = express();
app.use(cors());
app.use(express_winston.logger({
	winstonInstance: logger,
}));


app.get(`/recommend/:user_id`, async(req, res) => {
	const user_id = req.params.user_id;

	let user_uuid:UUID;
	try {
		user_uuid = new UUID(user_id);
	}
	catch (e){
		if (e instanceof UUIDError){
			logger.error(`/recommend/:user_id ${e.message}`);
			res.status(400).send(`ID is not a valid UUID`);
		}
		else if (e instanceof Error){
			logger.error(`Unexpected Error thrown: ${e.message}`);
			res.status(500).send(`There was an Error in the server`);
			throw e;
		}
		else {
			logger.error(`Unexpected '${typeof e}' was thrown: ${e}`);
			res.status(500).send(`There was an Error in the server`);
		}
		return;
	}
	logger.info(`User ID: ${user_uuid.id}`);

	let recommended_items: Event[];
	try {
		logger.info(`Trying to recommend items`);
		recommended_items = await Recommender.recommend(user_uuid);
		logger.info(`Items recommended`);
	}
	catch (e){
		if (e instanceof RecommenderError){
			logger.error(e.message);
			res.status(500).send(`Recommender Engine has not been set, please inform admin`);
		}
		else if (e instanceof Error){
			logger.error(`Unexpected Error thrown: ${e.message}`);
			res.status(500).send(`There was an Error in the server`);
			throw e;
		}
		else {
			logger.error(`Unexpected '${typeof e}' was thrown: ${e}`);
			res.status(500).send(`There was an Error in the server`);
		}
		return;
	}

	res.send(recommended_items);
});

const port = process.env[ `PORT` ] || 3000;
app.listen(port, async() => {

	const MYSQL_URI = process.env[ `MYSQL_URI` ] || `localhost`;
	const MYSQL_USER = process.env[ `MYSQL_USER` ] || `root`;
	const MYSQL_ROOT_PASSWORD = process.env[ `MYSQL_ROOT_PASSWORD` ] || `root`;
	const MYSQL_DATABASE = process.env[ `MYSQL_DATABASE` ] || `test`;

	const MYSQL_CREDENTIALS: mysql2.ConnectionOptions = {
		host     : MYSQL_URI,
		user     : MYSQL_USER,
		password : MYSQL_ROOT_PASSWORD,
		database : MYSQL_DATABASE,
	};
	const mysql_db = new MySQLDatabaseClient(MYSQL_CREDENTIALS);

	logger.info(`Server is running on http://localhost:${port}`);
	Recommender.set_recommender_method(new SportRecommenderEngine(mysql_db));
});