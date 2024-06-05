import getLogger from "./logger.js";
import { users } from "./data/users.js";
import { teams } from "./data/teams.js";
import { EventGenerator } from "./functionality/event_generator.js";
import { RandomEventGeneratorEngine } from "./functionality/event_generator_engine.js";
const logger = getLogger();
logger.info(teams);

EventGenerator.set_engine(new RandomEventGeneratorEngine());
logger.info(EventGenerator.generate_event());