import AuthRouter from './auth.router';
import UserRouter from './user.router';
import PingRouter from './ping.router';
import { routes } from './routes';

export default [
  { route: routes.auth, router: AuthRouter },
  { route: routes.user, router: UserRouter },
  { route: routes.ping, router: PingRouter },
];
