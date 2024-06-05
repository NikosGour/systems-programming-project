import { countries } from "./data/countries.js";
import { leagues } from "./data/leagues.js";
import { sports } from "./data/sports.js";

export type Country = typeof countries[number];
export type League = typeof leagues[number];
export type Sport = typeof sports[number];
export type Currency = typeof currencies[number];