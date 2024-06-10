import { MySQLDatabase } from "../database/mysqldatabase.js";
import getLogger from "../logger.js";
import amqplib, { ConfirmChannel, Connection } from "amqplib";
import { Event, isEvent, transformEvent } from "../../../systems_programming_lib/bin/models/event.js";
import { UUID } from "../../../systems_programming_lib/bin/functionality/uuid.js";


const logger = getLogger(`index.logs`);
export class Consumer{

	private queue: string;

	private connection_options: amqplib.Options.Connect;

	private connection: Connection | null = null;

	private channel: ConfirmChannel | null = null;

	private database: MySQLDatabase;

	constructor(connection_options: amqplib.Options.Connect, queue: string, database: MySQLDatabase){
		this.connection_options = connection_options;
		this.queue = queue;
		this.database = database;
	}

	async consume(){
		try {
			await this.init_connection();

			await this.channel?.assertQueue(this.queue, { durable: true });

			this.channel?.prefetch(1);

			this.channel?.consume(this.queue, async(msg: any) => {
				if (msg !== null){
					logger.info(`Received message:`);
					logger.info(msg.content.toString());
					const msg_json = JSON.parse(msg.content.toString());
					if (isEvent(msg_json)){
						await this.database.insert_event(transformEvent(msg_json));
					}
					else {
						logger.error(`Received message is not an event`);
						logger.error(msg_json);
					}
					this.channel?.ack(msg);
				}
			}, { noAck: false });

		}
		catch (err){
			logger.error(`Error consuming message`);
			throw err;
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