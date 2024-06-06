import getLogger from "../../recommender/bin/logger.js";
import { teams } from "./data/teams.js";
import { EventGenerator } from "./functionality/event_generator.js";
import { RandomEventGeneratorEngine } from "./functionality/event_generator_engine.js";
import { Producer } from "./messaging/Producer.js";
import { getRandomInt, sleep } from "../../recommender/bin/utils.js";
import dotenv from 'dotenv';
import amqplib from 'amqplib';
dotenv.config();

const logger = getLogger();
logger.info(teams);

EventGenerator.set_engine(new RandomEventGeneratorEngine());
logger.info(EventGenerator.generate_event());


const RMQ_URI = process.env[ `RABBITMQ_URI` ] || `localhost`;
logger.info(`RabbitMQ URI: ${RMQ_URI}`);
const RMQ_USER = process.env[ `RABBITMQ_DEFAULT_USER` ] || `guest`;
const RMQ_PASS = process.env[ `RABBITMQ_DEFAULT_PASS` ] || `guest`;

const CREDENTIALS:amqplib.Options.Connect = {
	protocol : `amqp`,
	hostname : RMQ_URI,
	port     : 5672,
	username : RMQ_USER,
	password : RMQ_PASS,
};
logger.info(`Starting the Producer`);
const prod:Producer = new Producer(CREDENTIALS, `events`);

const MAX_SLEEP_SECS = 10;
// eslint-disable-next-line no-constant-condition
while (true){
	const msg = JSON.stringify(EventGenerator.generate_event(), null, 1);
	// const msg = `nikos`;
	await prod.publish(msg);
	await sleep(getRandomInt(MAX_SLEEP_SECS) * 1000);
}