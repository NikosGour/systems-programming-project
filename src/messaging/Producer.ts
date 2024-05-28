import { AMQPClient } from "@cloudamqp/amqp-client";
import getLogger from "../logger.js";

const logger = getLogger(`index.logs`);
export class Producer{
	private client: AMQPClient;

	private queue: string;

	constructor(client: AMQPClient, queue: string){
		this.client = client;
		this.queue = queue;
	}

	async publish(message: string, routingKey: string){
		try {
			logger.info(`Connecting to RabbitMQ`);
			const connection = await this.client.connect();
			logger.info(`Connected to RabbitMQ`);

			logger.info(`Creating channel`);
			const channel = await connection.channel();
			logger.info(`Channel created`);

			logger.info(`Creating queue`);
			const queue = await channel.queue(this.queue, { durable: true });
			logger.info(`Queue created`);

			logger.info(`Publishing message`);
			await queue.publish(`Hello Nikos`);
			logger.info(`Message published`);
		}
		catch (err){
			logger.error(`Error publishing message: ${err}`);
		}
	}
}