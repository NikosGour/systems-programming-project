export const countries = [ `FRA`, `GRE`, `GER`, `UK`, `US` ] as const;
export const currencies = [ `EUR`, `USD`, `GBP` ] as const;
export const leagues = [ `Extraliga`, `UEFA`, `Euro` ] as const;
export const sports = [ `Handball`, `Football`, `Basketball` ] as const;

export const convert_to_country = (country:string) => {
	return countries[ countries.findIndex((c) => { return c === country; }) ];
};

export const convert_to_league = (league:string) => {
	return leagues[ leagues.findIndex((l) => { return l === league; }) ];
};

export const convert_to_sport = (sport:string) => {
	return sports[ sports.findIndex((s) => { return s === sport; }) ];
};

export const convert_to_currency = (currency:string) => {
	return currencies[ currencies.findIndex((c) => { return c === currency; }) ];
};