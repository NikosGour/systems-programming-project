import { AMQPClient } from "@cloudamqp/amqp-client";
import getLogger from "../logger.js";


const logger = getLogger(`index.logs`);
export class Consumer{
	private client: AMQPClient;

	private queue: string;

	constructor(client: AMQPClient, queue: string){
		this.client = client;
		this.queue = queue;
	}

	async consume(){
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

			logger.info(`Consuming messages`);
			await queue.subscribe({ noAck: true }, (msg) => {
				logger.info(`Received message: ${msg.bodyString()}`);
			});
		}
		catch (err){
			logger.error(`Error consuming message: ${err}`);
		}
	}
}