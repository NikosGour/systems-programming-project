import getLogger from "./logger.js";
import { users } from "./data/users.js";
const logger = getLogger();
logger.info(users);
logger.info(users.length);