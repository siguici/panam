import {
  bgBlack,
  bgBlue,
  bgCyan,
  bgGreen,
  bgMagenta,
  bgRed,
  bgWhite,
  bgYellow,
  black,
  blue,
  bold,
  cyan,
  dim,
  gray,
  green,
  grey,
  hidden,
  inverse,
  italic,
  magenta,
  red,
  reset,
  strikethrough,
  underline,
  white,
  yellow
} from 'kleur/colors';

export function isUnicodeSupported(): boolean {
  if (process.platform === 'win32') {
    return (
      Boolean(process.env.CI) ||
      Boolean(process.env.WT_SESSION) ||
      Boolean(process.env.TERMINUS_SUBLIME) ||
      process.env.ConEmuTask === '{cmd::Cmder}' ||
      process.env.TERM_PROGRAM === 'Terminus-Sublime' ||
      process.env.TERM_PROGRAM === 'vscode' ||
      process.env.TERM === 'xterm-256color' ||
      process.env.TERM === 'alacritty' ||
      process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
    );
  }
  return process.env.TERM !== 'linux';
}

const unicode = isUnicodeSupported();

export const icon = {
  success: unicode ? '✅' : '[OK]',
  error: unicode ? '❌' : '[ERROR]',
  info: unicode ? 'ℹ️' : '[INFO]',
  warning: unicode ? '⚠️' : '[WARN]',
  debug: unicode ? '🐞' : '[DEBUG]',
  verbose: unicode ? '🔍' : '[DETAILS]',
  line: unicode ? '──' : '----'
} as const;

export const styles = {
  colors: {
    red,
    green,
    blue,
    yellow,
    magenta,
    cyan,
    gray,
    grey,
    white,
    black
  },
  backgrounds: {
    red: bgRed,
    green: bgGreen,
    blue: bgBlue,
    yellow: bgYellow,
    magenta: bgMagenta,
    cyan: bgCyan,
    white: bgWhite,
    black: bgBlack
  },
  textStyles: {
    reset,
    bold,
    dim,
    italic,
    underline,
    inverse,
    hidden,
    strikethrough
  }
};

type Level = 'success' | 'error' | 'info' | 'warning' | 'debug' | 'verbose';

export type Logger = {
  log(
    message: string | number | Record<string, any>,
    ...messages: (string | number | Record<string, any>)[]
  ): void;
  info(
    message: string | number | Record<string, any>,
    ...messages: (string | number | Record<string, any>)[]
  ): void;
  warn(
    message: string | number | Record<string, any>,
    ...messages: (string | number | Record<string, any>)[]
  ): void;
  error(
    message: string | number | Record<string, any>,
    ...messages: (string | number | Record<string, any>)[]
  ): void;
  debug(
    message: string | number | Record<string, any>,
    ...messages: (string | number | Record<string, any>)[]
  ): void;
  trace(
    message: string | number | Record<string, any>,
    ...messages: (string | number | Record<string, any>)[]
  ): void;
};

export function format(
  message: string,
  level: Level,
  options?: {
    color?: keyof typeof styles.colors;
    background?: keyof typeof styles.backgrounds;
    style?: keyof typeof styles.textStyles;
  }
) {
  const iconToUse = icon[level];
  const colorToUse = options?.color
    ? styles.colors[options.color]
    : styles.colors.white;
  const backgroundToUse = options?.background
    ? styles.backgrounds[options.background]
    : styles.backgrounds.black;
  const styleToUse = options?.style
    ? styles.textStyles[options.style]
    : styles.textStyles.reset;

  const formattedMessage = styleToUse(`${iconToUse} ${message}`);
  return `${backgroundToUse}${colorToUse(formattedMessage)}${reset}`;
}

export class Printer {
  constructor(
    readonly logger: Logger,
    private readonly isProduction: boolean = false
  ) {}

  print(
    message: string,
    level: Level = 'info',
    options?: {
      color?: keyof typeof styles.colors;
      background?: keyof typeof styles.backgrounds;
      style?: keyof typeof styles.textStyles;
    }
  ) {
    if (this.isProduction && level === 'debug') {
      return;
    }

    let method: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace' = 'log';

    if (['success', 'verbose'].includes(level)) {
      method = 'info';
    } else {
      method = level as 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';
    }

    this.logger[method](format(message, level, options));
  }

  success(
    message: string,
    options?: {
      color?: keyof typeof styles.colors;
      background?: keyof typeof styles.backgrounds;
      style?: keyof typeof styles.textStyles;
    }
  ) {
    this.print(message, 'success', options);
  }

  error(
    message: string,
    options?: {
      color?: keyof typeof styles.colors;
      background?: keyof typeof styles.backgrounds;
      style?: keyof typeof styles.textStyles;
    }
  ) {
    this.print(message, 'error', options);
  }

  info(
    message: string,
    options?: {
      color?: keyof typeof styles.colors;
      background?: keyof typeof styles.backgrounds;
      style?: keyof typeof styles.textStyles;
    }
  ) {
    this.print(message, 'info', options);
  }

  warn(
    message: string,
    options?: {
      color?: keyof typeof styles.colors;
      background?: keyof typeof styles.backgrounds;
      style?: keyof typeof styles.textStyles;
    }
  ) {
    this.print(message, 'warning', options);
  }

  debug(
    message: string,
    options?: {
      color?: keyof typeof styles.colors;
      background?: keyof typeof styles.backgrounds;
      style?: keyof typeof styles.textStyles;
    }
  ) {
    this.print(message, 'debug', options);
  }

  verbose(
    message: string,
    options?: {
      color?: keyof typeof styles.colors;
      background?: keyof typeof styles.backgrounds;
      style?: keyof typeof styles.textStyles;
    }
  ) {
    this.print(message, 'verbose', options);
  }
}

const printer = new Printer(console, process.env.NODE_ENV === 'production');

export default printer;
