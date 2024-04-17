import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { UUID, UUIDError } from "./functionality/uuid.js";
import { Recommender } from "./functionality/recommender.js";
import logger from "./logger.js";
dotenv.config();
logger.info(new UUID(`550e8400-e29b-41d4-a716-446655440000`));
logger.debug(new UUID(`550e8400-e29b-41d4-a716-446655440000`));
logger.warn(new UUID(`550e8400-e29b-41d4-a716-446655440000`));
logger.error(new UUID(`550e8400-e29b-41d4-a716-446655440000`));
logger.silly(new UUID(`550e8400-e29b-41d4-a716-446655440000`));
const app = express();

app.use(cors());


app.get(`/recommend/:user_id`, (req, res) => {
	const user_id = req.params.user_id;

	let user_uuid:UUID;
	try {
		user_uuid = new UUID(user_id);
	}
	catch (e){
		if (e instanceof UUIDError){
			res.status(400).send(`ID is not a valid UUID`);
		}
		else if (e instanceof Error){
			console.error(`Unexpected Error thrown: ${e.message}`);
			res.status(500).send(`There was an Error in the server`);
		}
		else {
			console.error(`Unexpected '${typeof e}' was thrown: ${e}`);
			res.status(500).send(`There was an Error in the server`);
		}
		return;
	}
	console.log(`User ID: ${user_uuid.id}`);
	// const uuid_without_dashes = user_id.replace(/-/g, ``);
	// console.log(`User ID without dashes: ${uuid_without_dashes}`);
	// const user_id_int = parseInt(uuid_without_dashes, 16);
	// console.log(`User ID as an integer: ${user_id_int}`);
	// TODO: Implement the recommendation logic
	//const recommended_items = recommendation_func(user_id);
	const recommended_items = Recommender.recommend(user_uuid);
	console.log(`User`);

	res.send(recommended_items);
});


const port = process.env[ `PORT` ] || 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});