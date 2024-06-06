import mysql2 from 'mysql2/promise';
import { UUID } from '../functionality/uuid.js';
import { Coupon } from './coupon.js';
import { Bet } from './bet.js';
import { User } from './user.js';
import { Event } from './event.js';

const get_connection = async() => {
	return await mysql2.createConnection({
		host     : `localhost`,
		user     : `root`,
		password : `root`,
		database : `systems_programing`,
	});
};

export const get_all_users = async(): Promise<User[]> => {
	const connection = await get_connection();
	const [ rows, _ ]: [any, any] = await connection.execute(`SELECT * FROM users`);
	connection.end();
	return rows as User[];
};

export const get_user_by_uuid = async(uuid:UUID): Promise<User> => {
	const connection = await get_connection();
	const [ rows, _ ]: [any, any] = await connection.execute(`SELECT * FROM users WHERE uuid = ?`, [ uuid.id ]);
	connection.end();
	return rows[ 0 ] as User;
};

export const get_coupons_by_user_uuid = async(uuid:UUID):Promise<Coupon[]> => {
	const connection = await get_connection();
	const [ rows, _ ]: [any, any] = await connection.execute(`SELECT * FROM coupons WHERE user_id = ?`, [ uuid.id ]);
	connection.end();
	return rows as Coupon[];
};

export const get_bets_by_coupon_uuid = async(uuid:UUID):Promise<Bet[]> => {
	const connection = await get_connection();
	const [ rows, _ ]: [any, any] = await connection.execute(`SELECT * FROM bets WHERE coupon_id = ?`, [ uuid.id ]);
	connection.end();
	return rows as Bet[];
};

export const get_event_by_id = async(uuid:UUID): Promise<Event> => {
	const connection = await get_connection();
	const [ rows, _ ]: [any, any] = await connection.execute(`SELECT * FROM events WHERE uuid = ?`, [ uuid.id ]);
	connection.end();
	return rows[ 0 ] as Event;
};

export const get_x_events = async(x:number): Promise<Event[]> => {
	const connection = await get_connection();
	const [ rows, _ ]: [any, any] = await connection.execute(`SELECT * FROM events LIMIT ?`, [ x ]);
	connection.end();
	return rows as Event[];
};

export const get_event_by_sport = async(sport:string, limit:number): Promise<Event[]> => {
	const connection = await get_connection();
	const [ rows, _ ]: [any, any] = await connection.execute(`SELECT * FROM events WHERE sport = ?`, [ sport ]);
	connection.end();
	if (rows.length > limit){
		return rows.slice(0, limit) as Event[];
	}
	return rows as Event[];
};