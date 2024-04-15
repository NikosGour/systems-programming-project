import { Countries, } from "../utils.js";
import { UUID } from "../functionality/uuid.js";

export interface User {
	birth_year: number,
	country: Countries,
	currency: Currencies,
	gender: `M` | `F`,
	registration_date: Date,
	user_id: UUID
}

type Currencies = `EUR` | `USD` | `GBP`