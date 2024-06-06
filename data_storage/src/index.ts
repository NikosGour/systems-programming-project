import getLogger from "./logger.js";
import { Consumer } from "./messaging/Consumer.js";
import dotenv from "dotenv";
import amqlib from 'amqplib/callback_api.js';
import { MySQLDatabase } from "./database/mysqldatabase.js";
import mysql2 from 'mysql2';
dotenv.config();
const logger = getLogger();

const RMQ_URI = process.env[ `RABBITMQ_URI` ] || `localhost`;
logger.info(`RabbitMQ URI: ${RMQ_URI}`);
const RMQ_USER = process.env[ `RABBITMQ_DEFAULT_USER` ] || `guest`;
const RMQ_PASS = process.env[ `RABBITMQ_DEFAULT_PASS` ] || `guest`;

const RMQ_CREDENTIALS:amqlib.Options.Connect = {
	protocol : `amqp`,
	hostname : RMQ_URI,
	port     : 5672,
	username : RMQ_USER,
	password : RMQ_PASS,
};


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
const mysql_db = new MySQLDatabase(MYSQL_CREDENTIALS);

logger.info(`Starting Consumer`);
const cons:Consumer = new Consumer(RMQ_CREDENTIALS, `events`, mysql_db);
await cons.consume();