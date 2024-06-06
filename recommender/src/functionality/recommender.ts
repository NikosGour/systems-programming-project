import { UUID } from "./uuid.js";
import { Event } from "../models/event.js";
import { Team } from "../models/team.js";

export abstract class Recommender{
	private static recommendation_engine: RecommendationEngine;


	public static set_recommender_method(recommendation_engine: RecommendationEngine): void{
		Recommender.recommendation_engine = recommendation_engine;
	}

	public static async recommend(user:UUID):Promise<Event[]>{
		if (Recommender.recommendation_engine == null){
			throw new RecommenderError(`You need to set a recommendation engine before trying to recommend items`);
		}

		return await Recommender.recommendation_engine.recommend(user);
	}
}

export class RecommenderError extends Error{
	constructor(msg:string){
		super(msg);
	}
}
export interface RecommendationEngine{
	recommend(user:UUID): Promise<Event[]>
}

export class DummyRecommendationEngine implements RecommendationEngine{
	private events: Event[];

	constructor(){
		const event:Event = {
			begin_timestamp : new Date(),
			country         : `FRA`,
			end_timestamp   : new Date(),
			event_id        : new UUID(`87cd6f51-2699-4304-85bc-94038625be8d`),
			league          : `Euro`,
			sport           : `Basketball`,
			participants    : new Array<Team>(5),
		};

		this.events = [ { ... event }, { ... event }, { ... event }, { ... event }, { ... event }, { ... event }, { ... event } ];
	}

	public async recommend(_user: UUID): Promise<Event[]>{

		return await this.events;
	}

}