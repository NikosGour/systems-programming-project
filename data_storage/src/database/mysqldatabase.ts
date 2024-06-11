import getLogger from '@sys_lib/logger.js';
import mysql2 from "mysql2/promise";
import { Event } from "@sys_lib/models/event.js";
const logger = getLogger();
export class MySQLDatabase{

	private connection: mysql2.Connection | null = null;

	private connection_options: mysql2.ConnectionOptions;

	constructor(connection_options: mysql2.ConnectionOptions){
		this.connection_options = connection_options;
	}

	public async query(query: string, values?: any[]): Promise<mysql2.QueryResult | undefined>{

		try {
			await this.open_connection();

			logger.info(`Executing query: ${query}`);
			if (values != null){
				for (let i = 0; i < values.length; i++){
					logger.info(`Value ${i}: ${values[ i ]}`);
				}
				const [ results, _fields ] = await this.connection!.execute(query, values);
				logger.info(`Query executed`);
				return results;
			}

			const [ results, _fields ] = await this.connection!.execute(query);
			logger.info(`Query executed`);
			return results;


		}
		catch (err){
			logger.error(`Error executing query: ${query}, with values: ${values}`);
			logger.error(err);
			throw err;
		}
	}


	public async get_databases(): Promise<mysql2.QueryResult | undefined>{
		return await this.query(`SHOW DATABASES;`);
	}

	public async get_tables(): Promise<mysql2.QueryResult | undefined>{
		return await this.query(`SHOW TABLES;`);
	}

	public async insert_event(event: Event): Promise<mysql2.QueryResult | undefined>{
		const values = [ event.event_id.id,
			event.participants[ 0 ]!.name,
			event.participants[ 1 ]!.name,
			event.country,
			event.league,
			event.sport,
			convert_utc_to_mysql(event.begin_timestamp),
			convert_utc_to_mysql(event.end_timestamp) ];
		return await this.query(`INSERT INTO events (uuid, team1, team2, country, league, sport, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, values);

	}

	async open_connection(){
		if (this.connection == null){
			logger.info(`Opening connection to MySQL database`);
			this.connection = await mysql2.createConnection(this.connection_options);
			logger.info(`Connection to MySQL database opened`);
		}
	}
}

const convert_utc_to_mysql = (date: Date): string => {
	return date.toISOString().slice(0, 19)
		.replace(`T`, ` `);
};