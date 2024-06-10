import { Event } from "../../../systems_programming_lib/bin/models/event.js";
import { EventGeneratorEngine } from "./event_generator.js";
import { teams } from "../data/teams.js";
import getLogger from "../../../systems_programming_lib/bin/logger.js";
import { countries, leagues, sports } from "../../../systems_programming_lib/bin/data/lists.js";
import { Team } from "../../../systems_programming_lib/bin/models/team.js";
import { UUID } from "../../../systems_programming_lib/bin/functionality/uuid.js";
import { Country, League, Sport } from "../../../systems_programming_lib/bin/utils.js";

const logger = getLogger();

export class RandomEventGeneratorEngine implements EventGeneratorEngine{
	generate_event(): Event{
		logger.info(`Generating event`);

		const participants: Team[] = [];

		const team1: Team = teams[ Math.floor(Math.random() * teams.length) ]!;
		participants.push(team1);

		let team2: Team;
		do {
			team2 = teams[ Math.floor(Math.random() * teams.length) ]!;
		}
		while (team2 === participants[ 0 ]);
		participants.push(team2);

		const country:Country = countries[ Math.floor(Math.random() * countries.length) ]!;
		const sport: Sport = sports[ Math.floor(Math.random() * sports.length) ]!;
		const league: League = leagues[ Math.floor(Math.random() * leagues.length) ]!;

		const now:Date = new Date();
		const two_days:Date = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

		const event: Event = {
			begin_timestamp : now,
			country         : country,
			end_timestamp   : two_days,
			event_id       	: UUID.generate_uuid(),
			league         	: league,
			participants    : participants,
			sport           : sport,
		};
		return event;

	}
}