// This file is used to generate the tables for the database
// plus insert the data from the data files into the database
// In production, this would be done from the sys admins on the database

import mysql2, { RowDataPacket } from 'mysql2/promise';
import { teams } from '../data/teams.js';
import { users } from '../data/users.js';
import { Bet, Coupon } from '@sys_lib/models/coupon.js';
import { UUID } from '@sys_lib/functionality/uuid.js';
import { getRandomInt } from '@sys_lib/utils.js';
import dotenv from 'dotenv';
dotenv.config();
const MYSQL_URI = process.env[ `MYSQL_URI` ] || `localhost`;
const MYSQL_USER = process.env[ `MYSQL_USER` ] || `root`;
const MYSQL_ROOT_PASSWORD = process.env[ `MYSQL_ROOT_PASSWORD` ] || `root`;
const MYSQL_DATABASE = process.env[ `MYSQL_DATABASE` ] || `test`;

const MYSQL_CREDENTIALS: mysql2.ConnectionOptions = {
	host     : MYSQL_URI,
	user     : MYSQL_USER,
	password : MYSQL_ROOT_PASSWORD,
	database : MYSQL_DATABASE,
};

const get_connection = async() => {
	return await mysql2.createConnection(MYSQL_CREDENTIALS);
};

const create_tables = async() => {
	const conn = await get_connection();

	const table_users = `create table if not exists users (
    uuid varchar(36) primary key,
    gender text,
    country text,
    currency text,
    birth_year int,
    registration_date date
    );`;
	await conn.execute(table_users);

	const table_teams = `create table if not exists teams (
		name varchar(255) primary key
	);`;
	await conn.execute(table_teams);

	const table_events = `create table if not exists events (
		uuid varchar(36) primary key,
		team1 varchar(255),
		team2 varchar(255),
		country text,
		league text,
		sport text,
		start_date date,
		end_date date,
		FOREIGN KEY (team1) REFERENCES teams(name),
		FOREIGN KEY (team2) REFERENCES teams(name)
	);`;
	await conn.execute(table_events);

	const table_coupons = `create table if not exists coupons(
    uuid varchar(36) primary key,
    user_id varchar(36),
    stake float,
    timestamp datetime,
    FOREIGN KEY (user_id) REFERENCES users(uuid)
	);`;

	await conn.execute(table_coupons);

	const table_bets = `create table if not exists bets(
    id int primary key auto_increment,
    coupon_id varchar(36),
    event_id varchar(36),
    odds float,
    FOREIGN KEY (coupon_id) REFERENCES coupons(uuid),
    FOREIGN KEY (event_id) REFERENCES events(uuid)
	);`;

	await conn.execute(table_bets);

	conn.end();
};

const insert_users = async() => {
	const conn = await get_connection();

	const insert_users = `INSERT INTO users (uuid, gender, country, currency, birth_year, registration_date) VALUES ?`;

	const values = [];
	for (const user of users){
		values.push([ user.user_id.id, user.gender, user.country, user.currency, user.birth_year, user.registration_date ]);
	}

	await conn.query(insert_users, [ values ]);

	conn.end();
};

const insert_teams = async() => {
	const conn = await get_connection();

	const insert_teams = `INSERT INTO teams (name) VALUES ?`;

	const values = [];
	for (const team of teams){
		values.push([ team.name ]);
	}

	await conn.query(insert_teams, [ values ]);

	conn.end();
};

async function insert_coupons(){
	const conn = await get_connection();

	const get_all_users = `SELECT uuid FROM users`;

	const [ users, _ ]:[any, any] = await conn.query(get_all_users);

	const get_all_events = `SELECT uuid FROM events`;

	const [ events, _field2 ]:[any, any] = await conn.query(get_all_events);

	console.log(events.length);

	for (const user of users){
		const user_id = user.uuid;
		const number_of_coupons = getRandomInt(10, 1);

		const copouns:Coupon[] = [];

		for (let i = 0; i < number_of_coupons; i++){
			const coupon_id = UUID.generate_uuid();
			const stake = getRandomInt(100, 1);
			const timestamp = new Date();

			const number_of_bets = getRandomInt(3, 1);
			const bets:Bet[] = [];
			for (let j = 0; j < number_of_bets; j++){
				const event_id = events[ getRandomInt(events.length - 1) ].uuid;
				const odds = getRandomInt(100, 1);
				const bet:Bet = {
					event_id : event_id,
					odds    	: odds,

				};
				bets.push(bet);
			}

			const coupon:Coupon = {
				coupon_id  : coupon_id,
				user_id    : user_id,
				stake      : stake,
				timestamp  : timestamp,
				selections : bets,
			};

			copouns.push(coupon);
		}

		const insert_coupons = `INSERT INTO coupons (uuid, user_id, stake, timestamp) VALUES ?`;

		let values = [];
		for (const coupon of copouns){
			values.push([ coupon.coupon_id.id, user_id, coupon.stake, coupon.timestamp ]);
		}

		await conn.query(insert_coupons, [ values ]);

		const insert_bets = `INSERT INTO bets (coupon_id, event_id, odds) VALUES ?`;

		values = [];
		for (const coupon of copouns){
			for (const bet of coupon.selections){
				values.push([ coupon.coupon_id.id, bet.event_id, bet.odds ]);
			}
		}

		await conn.query(insert_bets, [ values ]);
	}

	conn.end();
}

await create_tables();
// await insert_teams();
// await insert_users();
await insert_coupons();
process.exit(0);