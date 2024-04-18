import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import express_winston from "express-winston";
import { UUID, UUIDError } from "./functionality/uuid.js";
import { DummyRecommendationEngine, Recommender, RecommenderError } from "./functionality/recommender.js";
import logger from "./logger.js";
import { Event } from "./models/event.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express_winston.logger({
	winstonInstance: logger
}));


app.get(`/recommend/:user_id`, (req, res) => {
	const user_id = req.params.user_id;

	let user_uuid:UUID;
	try {
		user_uuid = new UUID(user_id);
	}
	catch (e){
		if (e instanceof UUIDError){
			logger.error(`/recommend/:user_id ${e.message}`);
			res.status(400).send(`ID is not a valid UUID`);
		}
		else if (e instanceof Error){
			logger.error(`Unexpected Error thrown: ${e.message}`);
			res.status(500).send(`There was an Error in the server`);
		}
		else {
			logger.error(`Unexpected '${typeof e}' was thrown: ${e}`);
			res.status(500).send(`There was an Error in the server`);
		}
		return;
	}
	logger.info(`User ID: ${user_uuid.id}`);

	let recommended_items: Event[];
	try {
		recommended_items = Recommender.recommend(user_uuid);
	}
	catch (e){
		if (e instanceof RecommenderError){
			logger.error(e.message);
			res.status(500).send(`Recommender Engine has not been set, please inform admin`);
		}
		else if (e instanceof Error){
			logger.error(`Unexpected Error thrown: ${e.message}`);
			res.status(500).send(`There was an Error in the server`);
		}
		else {
			logger.error(`Unexpected '${typeof e}' was thrown: ${e}`);
			res.status(500).send(`There was an Error in the server`);
		}
		return;
	}
	logger.info(`User`);

	res.send(recommended_items);
});


const port = process.env[ `PORT` ] || 3000;
app.listen(port, () => {
	logger.info(`Server is running on http://localhost:${port}`);
	Recommender.set_recommender_method(new DummyRecommendationEngine());
});