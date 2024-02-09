import { ROUTES } from '@sqrib/shared';
import AuthRouter from './auth.router';
import SettingsRouter from './settings.router';
import UserRouter from './user.router';
import GameRouter from './game.router';
import MetricsRouter from './metrics.router';

export default [
  { route: ROUTES.auth, router: AuthRouter },
  { route: ROUTES.user, router: UserRouter },
  { route: ROUTES.settings, router: SettingsRouter },
  { route: ROUTES.game, router: GameRouter },
  { route: ROUTES.metrics, router: GameRouter },
  { route: ROUTES.metrics, router: MetricsRouter },
];
