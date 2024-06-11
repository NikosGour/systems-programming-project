import getLogger from "@sys_lib/logger.js";
import amqplib, { ConfirmChannel, Connection } from 'amqplib';

const logger = getLogger(`index.logs`);
export class Producer{
	private queue: string;

	private connection_options: amqplib.Options.Connect;

	private connection: Connection | null = null;

	private channel: ConfirmChannel | null = null;

	constructor(connection_options: amqplib.Options.Connect, queue: string){
		this.connection_options = connection_options;
		this.queue = queue;
	}



	async publish(message: string){
		try {
			await this.init_connection();

			logger.info(`Creating queue`);
			await this.channel!.assertQueue(this.queue, { durable: true });
			logger.info(`Queue created`);

			logger.info(`Publishing message`);
			this.channel?.sendToQueue(this.queue, Buffer.from(message), { persistent: true });
			logger.info(`Message: ${message}`);
		}
		catch (err){
			logger.error(`Error publishing message:${message}`);
			logger.error(`${err}`);
		}
	}



	async init_connection(){
		if (this.connection == null || this.channel == null){
			logger.info(`Connecting to RabbitMQ`);
			this.connection = await amqplib.connect(this.connection_options);
			logger.info(`Connected to RabbitMQ`);
			logger.info(`Creating channel`);
			this.channel = await this.connection.createConfirmChannel();
			logger.info(`Channel created`);
		}
	}
}