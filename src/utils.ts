
export function is_valid_uuid(uuid: string): boolean
{
	const uuid_regex = /^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}$/;
	return uuid_regex.test(uuid);
}

export function recommend_items(uuid: string): string[]
{
	return uuid.slice(0, 8).split(``);
}