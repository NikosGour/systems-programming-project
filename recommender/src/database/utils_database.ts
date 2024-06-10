import mysql2 from 'mysql2/promise';
import { UUID } from '../../../systems_programming_lib/bin/functionality/uuid.js';
import { Coupon } from './coupon.js';
import { Bet } from './bet.js';
import { User } from './user.js';
import { Event } from './event.js';


export class MySQLDatabaseClient{
	private connection: mysql2.Connection | null = null;

	private connection_options: mysql2.ConnectionOptions;

	constructor(connection_options:mysql2.ConnectionOptions){
		this.connection_options = connection_options;
	}

	public async get_all_users(): Promise<User[]>{
		await this.get_connection();
		const [ rows, _ ]: [any, any] = await this.connection!.execute(`SELECT * FROM users`);
		return rows as User[];
	}

	public async get_user_by_uuid(uuid:UUID): Promise<User>{
		await this.get_connection();
		const [ rows, _ ]: [any, any] = await this.connection!.execute(`SELECT * FROM users WHERE uuid = ?`, [ uuid.id ]);
		return rows[ 0 ] as User;
	}

	public async get_coupons_by_user_uuid(uuid:UUID):Promise<Coupon[]>{
		await this.get_connection();
		const [ rows, _ ]: [any, any] = await this.connection!.execute(`SELECT * FROM coupons WHERE user_id = ?`, [ uuid.id ]);
		return rows as Coupon[];
	}

	public async get_bets_by_coupon_uuid(uuid:UUID):Promise<Bet[]>{
		await this.get_connection();
		const [ rows, _ ]: [any, any] = await this.connection!.execute(`SELECT * FROM bets WHERE coupon_id = ?`, [ uuid.id ]);
		return rows as Bet[];
	}

	public async get_event_by_id(uuid:UUID): Promise<Event>{
		await this.get_connection();
		const [ rows, _ ]: [any, any] = await this.connection!.execute(`SELECT * FROM events WHERE uuid = ?`, [ uuid.id ]);
		return rows[ 0 ] as Event;
	}

	public async get_x_events(x:number): Promise<Event[]>{
		await this.get_connection();
		const [ rows, _ ]: [any, any] = await this.connection!.execute(`SELECT * FROM events`);
		if (rows.length > x){
			return rows.slice(0, x) as Event[];
		}
		return rows as Event[];
	}

	public async get_event_by_sport(sport:string, limit:number): Promise<Event[]>{
		await this.get_connection();
		const [ rows, _ ]: [any, any] = await this.connection!.execute(`SELECT * FROM events WHERE sport = ?`, [ sport ]);
		if (rows.length > limit){
			return rows.slice(0, limit) as Event[];
		}
		return rows as Event[];
	}

	public async get_connection(){
		if (this.connection == null){
			this.connection = await mysql2.createConnection(this.connection_options);
		}
	}

}