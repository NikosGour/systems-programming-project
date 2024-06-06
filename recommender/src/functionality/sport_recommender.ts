import { Bet } from "../database/bet.js";
import { Coupon } from "../database/coupon.js";
import { get_bets_by_coupon_uuid, get_coupons_by_user_uuid, get_event_by_id, get_event_by_sport, get_x_events } from "../database/utils_database.js";
import { Event } from "../models/event.js";
import * as database_e from "../database/event.js";
import { RecommendationEngine } from "./recommender.js";
import { UUID } from "./uuid.js";
import getLogger from "../logger.js";
import { Team } from "../models/team.js";
import { convert_to_country, convert_to_league, convert_to_sport, countries, leagues } from "../data/lists.js";

const logger = getLogger();
export class SportRecommenderEngine implements RecommendationEngine{
	async recommend(user: UUID): Promise<Event[]>{
		const recommended_items: Event[] = [];
		const coupons:Coupon[] = await get_coupons_by_user_uuid(user);

		const bets:Bet[] = [];
		for (const coupon of coupons){
			const bets_temp = await get_bets_by_coupon_uuid(new UUID(coupon.uuid));
			for (const bet of bets_temp){
				bets.push(bet);
			}
		}

		const events:database_e.Event[] = [];
		for (const bet of bets){
			const event = await get_event_by_id(new UUID(bet.event_id));
			events.push(event);
		}

		const sports:Map<string, number> = new Map<string, number>();
		for (const event of events){
			if (sports.has(event.sport)){
				sports.set(event.sport, sports.get(event.sport)! + 1);
			}
			else {
				sports.set(event.sport, 1);
			}
		}

		logger.info(sports);
		let max_sport:string = ``;
		let max_num:number = 0;
		for (const [ sport, num ] of sports){
			if (num > max_num){
				max_sport = sport;
				max_num = num;
			}
		}

		if (max_sport == ``){
			const events:database_e.Event[] = await get_x_events(5);
			for (const event of events){
				const e:Event = {
					begin_timestamp : event.start_date,
					country        	: convert_to_country(event.country)!,
					end_timestamp   : event.end_date,
					event_id        : new UUID(event.uuid),
					league          : convert_to_league(event.league)!,
					participants    : [ { name: event.team1 } as Team, { name: event.team2 } as Team ],
					sport           : convert_to_sport(event.sport)!,
				};

				recommended_items.push(e);
			}

			return recommended_items;
		}

		const sport_events:database_e.Event[] = await get_event_by_sport(max_sport, 5);

		for (const event of sport_events){
			const e:Event = {
				begin_timestamp : event.start_date,
				country        	: convert_to_country(event.country)!,
				end_timestamp   : event.end_date,
				event_id        : new UUID(event.uuid),
				league          : convert_to_league(event.league)!,
				participants    : [ { name: event.team1 } as Team, { name: event.team2 } as Team ],
				sport           : convert_to_sport(event.sport)!,
			};

			recommended_items.push(e);
		}

		return recommended_items;
	}

}