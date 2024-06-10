import { Event } from "../../../systems_programming_lib/bin/models/event.js";
export abstract class EventGenerator{
	private static _instance: EventGeneratorEngine;

	public static set_engine(engine: EventGeneratorEngine){
		this._instance = engine;
	}

	public static generate_event(){
		if (EventGenerator._instance == null){
			throw new EventGeneratorError(`EventGenerator engine is not set.`);
		}

		return EventGenerator._instance.generate_event();
	}
}

export class EventGeneratorError extends Error{
	constructor(msg:string){
		super(msg);
	}
}

export interface EventGeneratorEngine{
	generate_event() : Event;
}