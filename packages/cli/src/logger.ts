import { blue, cyan, green, magenta, red, yellow } from 'kleur/colors';

import figures from 'figures';

type Level = 'success' | 'info' | 'error' | 'warning' | 'debug' | 'verbose';

const logger = {
  success: (message: string) =>
    console.log(`${green(figures.tick)} ${green(message)}`),

  info: (message: string) =>
    console.info(`${blue(figures.info)} ${blue(message)}`),

  error: (message: string) =>
    console.error(`${red(figures.cross)} ${red(message)}`),

  warning: (message: string) =>
    console.warn(`${yellow(figures.warning)} ${yellow(message)}`),

  debug: (message: string) =>
    console.log(`${magenta(figures.pointerSmall)} ${magenta(message)}`),

  verbose: (message: string) =>
    console.log(`${cyan(figures.ellipsis)} ${cyan(message)}`),

  log: (level: Level, message: string) => {
    const logLevels = {
      success: () => logger.success(message),
      info: () => logger.info(message),
      error: () => logger.error(message),
      warning: () => logger.warning(message),
      debug: () => logger.debug(message),
      verbose: () => logger.verbose(message)
    };
    logLevels[level]?.();
  }
};

export default logger;
