import { Country, League, Sport } from "../utils.js";
import { UUID } from "../functionality/uuid.js";
import { Team } from "./team.js";

export interface Event{
	begin_timestamp : Date,
	country         : Country,
	end_timestamp   : Date,
	event_id        : UUID,
	league          : League
	participants    : Team[],
	sport           : Sport
}