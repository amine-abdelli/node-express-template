import pino from 'pino';

const baseLogger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

const logWrapper = {
  info: (msg: string, obj: unknown = {}) => baseLogger.info(obj, msg),
  error: (msg: string, obj: unknown = {}) => baseLogger.error(obj, msg),
  warn: (msg: string, obj: unknown = {}) => baseLogger.warn(obj, msg),
  fatal: (msg: string, obj: unknown = {}) => baseLogger.fatal(obj, msg),
};

export { logWrapper as log };
