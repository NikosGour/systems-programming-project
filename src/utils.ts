import { resourceUsage } from "process";



export function recommend_items(uuid: string): string[]
{
	return uuid.slice(0, 8).split(``);
}

export class UUID
{
	private _id:string;

	constructor(id:string)
	{
		if (UUID.is_valid_uuid(id))
		{
			this._id = id;
		}
		else
		{
			throw new Error(`Trying to create UUID with invalid string: "${id}"`);
		}
	}

	public get id()
	{
		return this._id;
	}

	public static is_valid_uuid(uuid: string): boolean
	{
		const uuid_regex = /^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}$/;
		if (uuid.length != 36) return false;
		return uuid_regex.test(uuid);
	}

}

export type Countries = `FRA` | `GRE` | `GER` | `UK` | `US`