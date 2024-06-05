import getLogger from "../../recommender/bin/logger.js";
import { teams } from "./data/teams.js";
import { EventGenerator } from "./functionality/event_generator.js";
import { RandomEventGeneratorEngine } from "./functionality/event_generator_engine.js";
import { Producer } from "./messaging/Producer.js";
import { getRandomInt, sleep } from "../../recommender/bin/utils.js";
import { AMQPClient } from '@cloudamqp/amqp-client';
import dotenv from 'dotenv';
dotenv.config();

const logger = getLogger();
logger.info(teams);

EventGenerator.set_engine(new RandomEventGeneratorEngine());
logger.info(EventGenerator.generate_event());


const rabbitmq_uri = process.env[ `RABBITMQ_URI` ] || `localhost`;
logger.info(`RabbitMQ URI: ${rabbitmq_uri}`);
const client:AMQPClient = new AMQPClient(`amqp://${rabbitmq_uri}`);
client.username = process.env[ `RABBITMQ_DEFAULT_USER` ] || `guest`;
client.password = process.env[ `RABBITMQ_DEFAULT_PASS` ] || `guest`;
logger.info(`Starting the Producer`);
const prod:Producer = new Producer(client, `events`);

const MAX_SLEEP_SECS = 10;
// eslint-disable-next-line no-constant-condition
while (true){
	// const msg = JSON.stringify(EventGenerator.generate_event(), null, 1);
	const msg = `nikos`;
	await prod.publish(msg, `events`);
	await sleep(getRandomInt(MAX_SLEEP_SECS) * 1000);
}