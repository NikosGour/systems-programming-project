import { Recommender, DummyRecommendationEngine } from "../functionality/recommender.js";
import { UUID } from "../functionality/uuid.js";
import { jest } from '@jest/globals';
import { Event } from "../models/event.js";
import { Team } from "../models/team.js";
jest.useFakeTimers();
describe(`Testing Recommend.recommend()`, () => {

	const event:Event = {
		begin_timestamp : new Date(),
		country         : `FRA`,
		end_timestamp   : new Date(),
		event_id        : new UUID(`87cd6f51-2699-4304-85bc-94038625be8d`),
		league          : `Euro`,
		sport           : `Basketball`,
		participants    : new Array<Team>(5)
	};

	const uuid = new UUID(`a9a0af8d-f571-45d9-8eb3-6a67dc633bbd`);

	test(`Should throw, as no RecommendationEngine is set`, () => {
		expect(() => { return Recommender.recommend(uuid); }).toThrow(/You need to set a recommendation/);
	});

	test(`Should return an array of 5 events`, () => {
		const re = new DummyRecommendationEngine();
		Recommender.set_recommender_method(re);
		const res = [ { ...event }, { ...event }, { ...event }, { ...event }, { ...event }, { ...event }, { ...event } ];
		expect(Recommender.recommend(uuid)).toMatchObject(res);
	});
});