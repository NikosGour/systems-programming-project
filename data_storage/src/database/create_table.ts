import getLogger from '../logger.js';
import mysql2, { QueryError } from "mysql2";
const logger = getLogger();
export class MySQLDatabase{

	private connection: mysql2.Connection | null = null;

	private connection_options: mysql2.ConnectionOptions;

	constructor(connection_options: mysql2.ConnectionOptions){
		this.connection_options = connection_options;
	}

	public async get_databases(){

		try {
			this.open_connection();

			this.connection!.connect((err: QueryError | null) => {
				if (err){
					logger.error(`Error this.connectionecting to MySQL database:`);
					logger.error(err.message);
					return;
				}
				logger.info(`this.connectionection to MySQL database opened`);
				this.connection!.query(`SHOW DATABASES`, (err: QueryError | null, results) => {
					if (err){
						logger.error(`Error querying MySQL database:`);
						logger.error(err.message);
						return;
					}
					logger.info(`Databases:`);
					logger.info(results);
					// for (let i = 0; i < results.length; i++){
					// 	logger.info(results[i].Database);
					// }
				});
			});

		}
		catch (err){
			logger.error(`Error opening connection to SQLite database:`);
			logger.error(err);
		}
	}

	public async get_tables(){

		try {
			this.open_connection();

			this.connection!.connect((err: QueryError | null) => {
				if (err){
					logger.error(`Error this.connectionecting to MySQL database:`);
					logger.error(err.message);
					return;
				}
				logger.info(`this.connectionection to MySQL database opened`);
				this.connection!.query(`SHOW TABLES`, (err: QueryError | null, results) => {
					if (err){
						logger.error(`Error querying MySQL database:`);
						logger.error(err.message);
						return;
					}
					logger.info(`Tables:`);
					logger.info(results);
					// for (let i = 0; i < results.length; i++){
					// 	logger.info(results[i].Database);
					// }
				});
			});

		}
		catch (err){
			logger.error(`Error opening connection to SQLite database:`);
			logger.error(err);
		}
	}

	async open_connection(){
		if (this.connection == null){
			logger.info(`Opening connection to MySQL database`);
			this.connection = mysql2.createConnection(this.connection_options);
		}
	}
}