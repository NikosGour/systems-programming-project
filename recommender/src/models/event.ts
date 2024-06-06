import { Country, League, Sport } from "../utils.js";
import { UUID } from "../functionality/uuid.js";
import { Team } from "./team.js";

export interface Event{
	begin_timestamp : Date,
	country         : Country,
	end_timestamp   : Date,
	event_id        : UUID,
	league          : League
	participants    : Team[],
	sport           : Sport
}
export const isEvent = (obj: any): obj is Event => {
	try {

		if (obj == null || typeof obj !== `object`){
			return false;
		}
		if (Number.isNaN(Date.parse(obj.begin_timestamp))){
			console.log(`begin_timestamp`);
			return false;
		}

		if (Number.isNaN(Date.parse(obj.end_timestamp))){
			console.log(`end_timestamp`);
			return false;
		}

		if (!UUID.is_valid_uuid(obj.event_id._id)){
			console.log(`event_id`);
			return false;
		}

		if (typeof obj.league !== `string`){
			console.log(`league`);
			return false;
		}

		if (!Array.isArray(obj.participants)){
			console.log(`participants`);
			return false;
		}
		if (obj.participants.length < 2){
			console.log(`participants len`);
			return false;
		}

		if (typeof obj.sport !== `string`){
			console.log(`sport`);
			return false;
		}

		return true;
	}
	catch (e){
		console.log(`isEvent Error: ${e}`);
		throw e;
	}



};