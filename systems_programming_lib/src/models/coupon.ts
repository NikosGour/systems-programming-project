import { UUID } from "../functionality/uuid.js";

export interface Coupon{
	coupon_id  : UUID,
	selections : Bet[],
	stake      : number,
	timestamp  : Date,
	user_id    : UUID
}

export interface Bet{
	event_id : UUID,
	odds     : number
}