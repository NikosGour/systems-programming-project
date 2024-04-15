export function recommend_items(uuid: string): string[]
{
	return uuid.slice(0, 8).split(``);
}

export type Countries = `FRA` | `GRE` | `GER` | `UK` | `US`