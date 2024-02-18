import express from 'express';

import * as HealthCheck from 'src/controllers/ping.controller';
import { endpoints } from 'src/routers/routes';

const router = express.Router();

router.get(endpoints.ping, HealthCheck.ping);

export default router;
