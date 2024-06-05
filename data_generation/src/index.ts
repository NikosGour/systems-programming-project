import getLogger from "./logger.js";
import { users } from "./data/users.js";
import { EventGenerator } from "./functionality/event_generator.js";
import { RandomEventGeneratorEngine } from "./functionality/event_generator_engine.js";
const logger = getLogger();
logger.info(users);

EventGenerator.set_engine(new RandomEventGeneratorEngine());
logger.info(EventGenerator.generate_event());