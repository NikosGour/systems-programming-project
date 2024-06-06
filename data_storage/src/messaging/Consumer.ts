import getLogger from "../logger.js";
import amqplib, { ConfirmChannel, Connection } from "amqplib";


const logger = getLogger(`index.logs`);
export class Consumer{

	private queue: string;

	private connection_options: amqplib.Options.Connect;

	private connection: Connection | null = null;

	private channel: ConfirmChannel | null = null;

	constructor(connection_options: amqplib.Options.Connect, queue: string){
		this.connection_options = connection_options;
		this.queue = queue;
	}

	async consume(){
		try {
			await this.init_connection();

			await this.channel?.assertQueue(this.queue, { durable: true });

			this.channel?.prefetch(1);

			this.channel?.consume(this.queue, (msg: any) => {
				if (msg !== null){
					logger.info(`Received message:`);
					logger.info(msg.content.toString());
					this.channel?.ack(msg);
				}
			}, { noAck: false });

		}
		catch (err){
			logger.error(`Error consuming message`);
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