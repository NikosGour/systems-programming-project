import util from "util";
import { createLogger, format, transports, addColors } from 'winston';
const { combine, colorize, label, timestamp, printf } = format;

const pretty_print_json = (json: object): string => {
	return util.inspect(json, {
		colors : true,
		depth  : null,
	});
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const LOGGER_MSG_ICONS = {
	ERROR : `🟥`,
	WARN  : `🟨`,
	INFO  : `🟦`,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const LOGGER_MSG_COLORS = {
	error : `bold red`,
	warn  : `italic yellow`,
	info  : `bold blue`,
};

export const customFormat = format.combine(
	label({ label: `[MAIN]` }),
	timestamp({ format: `DD-MM-YY HH:mm:ss` }),
	format((info) => {
		info.level = info.level.toUpperCase();
		return info;
	})(),
	format.prettyPrint({
		colorize : true,
		depth    : 3,
	}),
	colorize(),
	printf((info) => {
		// eslint-disable-next-line no-control-regex
		const cleanLevel = info.level.replace(/\u001b\[.*?m/g, ``);
		const pre = LOGGER_MSG_ICONS[ cleanLevel as keyof typeof LOGGER_MSG_ICONS ] || `⬛`;

		if (typeof info.message === `object`){
			return ` ${pre} | ${info[ `label` ]} | ${info[ `timestamp` ]} | ${info.level} | ${pretty_print_json(info.message)}`;
		}
		return ` ${pre} | ${info[ `label` ]} | ${info[ `timestamp` ]} | ${info.level} | ${info.message}`;
	})
);

export const customFormatWithoutColors = format.combine(
	label({ label: `[MAIN]` }),
	timestamp({ format: `DD-MM-YY HH:mm:ss` }),
	format((info) => {
		info.level = info.level.toUpperCase();
		return info;
	})(),
	format.prettyPrint({
		colorize : true,
		depth    : 3,
	}),
	printf((info) => {
		// eslint-disable-next-line no-control-regex
		const cleanLevel = info.level.replace(/\u001b\[.*?m/g, ``);
		const pre = LOGGER_MSG_ICONS[ cleanLevel as keyof typeof LOGGER_MSG_ICONS ] || `⬛`;

		if (typeof info.message === `object`){
			return ` ${pre} | ${info[ `label` ]} | ${info[ `timestamp` ]} | ${info.level} | ${pretty_print_json(info.message)}`;
		}
		return ` ${pre} | ${info[ `label` ]} | ${info[ `timestamp` ]} | ${info.level} | ${info.message}`;
	})
);
addColors(LOGGER_MSG_COLORS);

const getLogger = (filename?:string) => {
	if (filename){
		return createLogger({
			level      : `debug`,
			transports : [
				new transports.Console({ format: combine(customFormat) }),
				new transports.File({
					filename : filename,
					format   : combine(customFormatWithoutColors),
				}),
			],
		});
	}

	return createLogger({
		level      : `debug`,
		transports : [
			new transports.Console({ format: combine(customFormat) }),
		],
	});

};

export default getLogger;