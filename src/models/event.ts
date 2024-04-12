import { Countries, UUID } from "../utils.js";
import { Team } from "./team.js";

export interface Event {
	begin_timestamp: Date,
	country: Countries,
	end_timestamp: Date,
	event_id: UUID,
	league: League
	participants: Team[],
	sport: Sport
}

type League = `Extraliga` | `UEFA` | `Euro`
type Sport = `Handball` | `Football` | `Basketball`