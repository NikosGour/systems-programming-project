import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.get(`/recommend/:user_id`, (req, res) =>
{
	const user_id = req.params.user_id;
	if (user_id === ``)
	{
		res.status(400).send(`User ID is required`);
		return;
	}

	const uuid_regex = /^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}$/;
	if (!uuid_regex.test(user_id))
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
	const recommended_items = user_id.slice(0, 8).split(``);

	res.send(`Hello ${recommended_items}!`);
});


const port = process.env[ `PORT` ] || 3000;
app.listen(port, () =>
{
	console.log(`Server is running on http://localhost:${port}`);
});