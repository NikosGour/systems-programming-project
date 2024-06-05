import { UUID } from "../functionality/uuid.js";
import { Country, Currency } from "../utils.js";

export interface User{
	birth_year        : number,
	country           : Country,
	currency          : Currency,
	gender            : `M` | `F`,
	registration_date : Date,
	user_id           : UUID
}