import { UUID } from "../utils.js";

export interface Coupon{
	coupon_id: UUID,
	selections: Bet[],
	stake: number,
	timestamp: Date,
	user_id:UUID
}

interface Bet {
	event_id: UUID,
	odds: number
}