import getLogger from "./logger.js";
import { Consumer } from "./messaging/Consumer.js";
import dotenv from "dotenv";
import { credentials } from "amqplib";
import amqlib from 'amqplib/callback_api.js';
dotenv.config();
const logger = getLogger();

const RMQ_URI = process.env[ `RABBITMQ_URI` ] || `localhost`;
logger.info(`RabbitMQ URI: ${RMQ_URI}`);
const RMQ_USER = process.env[ `RABBITMQ_DEFAULT_USER` ] || `guest`;
const RMQ_PASS = process.env[ `RABBITMQ_DEFAULT_PASS` ] || `guest`;

const CREDENTIALS:amqlib.Options.Connect = {
	protocol : `amqp`,
	hostname : RMQ_URI,
	port     : 5672,
	username : RMQ_USER,
	password : RMQ_PASS,
};

logger.info(`Starting Consumer`);
const cons:Consumer = new Consumer(CREDENTIALS, `events`);
await cons.consume();