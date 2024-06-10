import { countries, currencies, leagues, sports } from './data/lists.js';

export type Country = typeof countries[number];
export type League = typeof leagues[number];
export type Sport = typeof sports[number];
export type Currency = typeof currencies[number];

export const sleep = (ms: number) => { return new Promise((resolve) => { return setTimeout(resolve, ms); }); };

export const getRandomInt = (max:number, min:number = 0) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};