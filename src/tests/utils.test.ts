import {UUID} from "../utils.js";


const uuids = [
	`3fc1b02a-8095-4b43-85e9-fc066142916d`,
	`a9a0af8d-f571-45d9-8eb3-6a67dc633bbd`,
	`211a4525-6aac-4c8a-abb2-96af3d225394`,
	`e0fcbf97-9c8d-40ab-800c-6786ef18c956`,
	`12cf4373-0160-4cfb-81e3-83ca213da61b`,
	`a603760d-6ca3-4b91-be08-2c4a0ea580ae`,
	`9b57a131-96f9-4416-b5e2-b7c8ad96500c`,
	`5b82057a-275e-4489-9f51-52769d1d8467`,
	`87cd6f51-2699-4304-85bc-94038625be8d`,
	`be78bf3c-45b5-42fa-8649-fa3b049601f6`,
	`550e8400-e29b-41d4-a716-446655440000`
];

const failing_uuids =
	[
		`Nikos`,
		`Xristos`,
		`Testing`,
		`Systems Programming`,
		`Email`,
		`87cd6f512699430485bc94038625be8d`,
		`be78bf3c-45b542fa8649-fa3b049601f6`,
		`550e8400e29b41d4-a716-446655440000`,
	];
describe(`UUID.is_valid_uuid function`, () =>
{


	test.each(uuids)(`Testing succeful:"%s"`, (uuid: string) =>
	{
		expect(UUID.is_valid_uuid(uuid)).toBe(true);
	});

	test.each(failing_uuids)(`Testing failing: "%s"`, (uuid: string) =>
	{
		expect(UUID.is_valid_uuid(uuid)).toBe(false);
	});
});

describe(`UUID Class`, () =>
{
	test.each(uuids)(`'new UUID()' should not throw, a it is given a valid UUID: "%s"`, (uuid: string) =>
	{
		expect(() => { return new UUID(uuid); }).not.toThrow(/Trying to create/);
	});

	test.each(failing_uuids)(`'new UUID()' should throw, as it is given invalid UUID: "%s"`, (uuid: string) =>
	{
		expect(() => { return new UUID(uuid); }).toThrow(/Trying to create/);
	});

	test.each(uuids)(`'new UUID()' should not throw, a it is given a valid UUID: "%s"`, (uuid: string) =>
	{
		expect(new UUID(uuid).id).toEqual(uuid);
	});
});