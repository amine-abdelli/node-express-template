import express from 'express';
import * as HealthCheck from 'src/controllers/health.controller';

import { endpoints } from 'src/routers/routes';

const router = express.Router();

router.get(endpoints['health-check'], HealthCheck.check);

export default router;
