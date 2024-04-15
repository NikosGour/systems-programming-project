export abstract class Recommender
{
	private static recommendation_engine: RecommendationEngine;


	public static set_recommender_method(recommendation_engine: RecommendationEngine): void
	{

	}
}

export type RecommendationEngine = string;