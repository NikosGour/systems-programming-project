import { countries, currencies, leagues, sports } from "../../recommender/src/data/lists.js";

export type Country = typeof countries[number];
export type League = typeof leagues[number];
export type Sport = typeof sports[number];
export type Currency = typeof currencies[number];