import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { recommend_items } from "./utils.js";
import { UUID } from "./functionality/uuid.js";

dotenv.config();
console.log(new UUID(`550e8400-e29b-41d4-a716-446655440000`));
const app = express();

app.use(cors());


const recommendation_func = recommend_items;
app.get(`/recommend/:user_id`, (req, res) =>
{
	const user_id = req.params.user_id;

	if (UUID.is_valid_uuid(user_id))
	{
		res.status(400).send(`ID is not a valid UUID`);
		return;
	}
	console.log(`User ID: ${user_id}`);
	// const uuid_without_dashes = user_id.replace(/-/g, ``);
	// console.log(`User ID without dashes: ${uuid_without_dashes}`);
	// const user_id_int = parseInt(uuid_without_dashes, 16);
	// console.log(`User ID as an integer: ${user_id_int}`);
	// TODO: Implement the recommendation logic
	const recommended_items = recommendation_func(user_id);

	res.send(recommended_items);
});


const port = process.env[ `PORT` ] || 3000;
app.listen(port, () =>
{
	console.log(`Server is running on http://localhost:${port}`);
});