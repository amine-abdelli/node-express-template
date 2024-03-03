import express from 'express';

import * as HealthCheck from 'src/controllers/ping.controller';
import { endpoints } from 'src/routers/routes';

const router = express.Router();

/**
 * Handle ping request
 * Aim to check if the server is up and running
 * @path /ping
 * @method GET
 * @public route
 */
router.get(endpoints.ping, HealthCheck.ping);

export default router;
