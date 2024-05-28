import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import express_winston from "express-winston";
import { UUID, UUIDError } from "./functionality/uuid.js";
import { DummyRecommendationEngine, Recommender, RecommenderError } from "./functionality/recommender.js";
import getLogger from "./logger.js";
import { Event } from "./models/event.js";
import { Producer } from "./messaging/Producer.js";
import { AMQPClient } from "@cloudamqp/amqp-client";
import { exit } from "process";
import { cli } from "winston/lib/winston/config/index.js";
import { Consumer } from "./messaging/Consumer.js";

dotenv.config();
const logger = getLogger(`index.logs`);

const app = express();
app.use(cors());
app.use(express_winston.logger({
	winstonInstance: logger,
}));

const rabbitmq_uri = process.env[ `RABBITMQ_URI` ] || `localhost`;
logger.info(`RabbitMQ URI: ${rabbitmq_uri}`);
const client:AMQPClient = new AMQPClient(`amqp://${rabbitmq_uri}`);
client.username = process.env[ `RABBITMQ_DEFAULT_USER` ] || `guest`;
client.password = process.env[ `RABBITMQ_DEFAULT_PASS` ] || `guest`;



app.get(`/recommend/:user_id`, (req, res) => {
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
		recommended_items = Recommender.recommend(user_uuid);
	}
	catch (e){
		if (e instanceof RecommenderError){
			logger.error(e.message);
			res.status(500).send(`Recommender Engine has not been set, please inform admin`);
		}
		else if (e instanceof Error){
			logger.error(`Unexpected Error thrown: ${e.message}`);
			res.status(500).send(`There was an Error in the server`);
		}
		else {
			logger.error(`Unexpected '${typeof e}' was thrown: ${e}`);
			res.status(500).send(`There was an Error in the server`);
		}
		return;
	}
	logger.info(`User`);

	res.send(recommended_items);
});

const port = process.env[ `PORT` ] || 3000;
app.listen(port, async() => {
	// logger.info(`Starting the Producer`);
	// const prod:Producer = new Producer(client, `events`);
	// await prod.publish(`Hello Nikos`, `events`);
	logger.info(`Starting Consumer`);
	const cons:Consumer = new Consumer(client, `events`);
	await cons.consume();
	logger.info(`Server is running on http://localhost:${port}`);
	Recommender.set_recommender_method(new DummyRecommendationEngine());
});