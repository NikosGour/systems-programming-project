import { AMQPChannel, AMQPClient, AMQPError } from "@cloudamqp/amqp-client";
import getLogger from "../../../recommender/bin/logger.js";
import { AMQPBaseClient } from "@cloudamqp/amqp-client/amqp-base-client";

const logger = getLogger(`index.logs`);
export class Producer{
	private client: AMQPClient;

	private queue: string;

	private connection: AMQPBaseClient | null = null;

	private channel: AMQPChannel | null = null;

	constructor(client: AMQPClient, queue: string){
		this.client = client;
		this.queue = queue;

	}


	async publish(message: string, routingKey: string){
		try {
			await this.init_connection();
			logger.info(`Creating queue`);
			const queue = await this.channel!.queue(this.queue, { durable: true });
			logger.info(`Queue created`);

			logger.info(`Publishing message`);
			await queue.publish(message);
			logger.info(`Message: ${message}`);
		}
		catch (err){
			if (err instanceof AMQPError){
				logger.error(`Error publishing message:${message}`);
				logger.error(`${err}`);
			}
			else {
				throw err;
			}
		}
	}


	async init_connection(){
		if (this.connection == null || this.channel == null){
			logger.info(`Connecting to RabbitMQ`);
			this.connection = await this.client.connect();
			logger.info(`Connected to RabbitMQ`);

			logger.info(`Creating channel`);
			this.channel = await this.connection.channel();
			logger.info(`Channel created`);
		}
	}
}