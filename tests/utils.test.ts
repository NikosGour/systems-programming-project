import {is_valid_uuid} from "../src/utils";

describe(`Sum function`, () =>
{
	test(`Returns correct value`, () =>
	{
		const a = (b:number, c:number) =>
		{
			return b+c;
		};
		expect(1 + 1).toBe(2);
	});
});

describe(`is_valid_uuid function`, () =>
{
	test(`Returns true for valid UUID`, () =>
	{
		expect(is_valid_uuid(`550e8400-e29b-41d4-a716-446655440000`)).toBe(true);
	});
	test(`Returns false for invalid UUID`, () =>
	{
		expect(is_valid_uuid(`testing`)).toBe(false);
	});
});