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
	// TODO: Test if the following code is correct
	if (isNaN(Number(user_id)))
	{
		res.status(400).send(`User ID must be a number`);
		return;
	}
	// TODO: add more guards
	// TODO: Implement the recommendation logic



	res.send(`Hello ${user_id}!`);
});


const port = process.env[ `PORT` ] || 3000;
app.listen(port, () =>
{
	console.log(`Server is running on http://localhost:${port}`);
});