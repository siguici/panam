import { Command } from 'commander';
import {
  add,
  create,
  dlx,
  exec,
  install,
  jsrAdd,
  jsrRemove,
  jsrRun,
  jsrX,
  remove,
  run,
  x
} from 'panam';
import { description, name, version } from '../package.json';
import logger from './logger';

const program = new Command();

program.name(name).description(description).version(version);

const defaultOptions = { daemon: false };

const handleError = (err: any, context: string) => {
  const errorMessage = err?.message || 'An unexpected error occurred.';
  logger.error(`${context}: ${errorMessage}`);
};

program
  .command('install')
  .description('Install all project dependencies.')
  .action(async () => {
    logger.info('Installing project dependencies...');
    try {
      await install(defaultOptions);
      logger.success('All dependencies installed successfully.');
    } catch (err) {
      handleError(err, 'Dependency installation failed');
    }
  });

program
  .command('create <cli>')
  .description('Create a new project or package using a template.')
  .action(async (cli) => {
    logger.info(`Initializing project with template "${cli}".`);
    try {
      await create(cli, { daemon: false });
      logger.success(
        `Project initialized successfully with template "${cli}".`
      );
    } catch (err) {
      handleError(err, `Failed to initialize project with template "${cli}"`);
    }
  });

program
  .command('add <packages...>')
  .alias('use')
  .description('Add one or more dependencies to the project.')
  .action(async (packages) => {
    const packagesStr = packages?.join(' ') || '';
    logger.info(`Adding dependencies "${packagesStr}".`);
    try {
      await add(packages, defaultOptions);
      logger.success(`Dependencies "${packagesStr}" added successfully.`);
    } catch (err) {
      handleError(err, `Failed to add dependencies "${packagesStr}"`);
    }
  });

program
  .command('remove <packages...>')
  .alias('uninstall')
  .description('Remove one or more dependencies from the project dependencies.')
  .action(async (packages) => {
    const packagesStr = packages?.join(' ') || '';
    logger.info(`Removing dependencies "${packagesStr}".`);
    try {
      await remove(packages, defaultOptions);
      logger.success(`Dependencies "${packagesStr}" removed successfully.`);
    } catch (err) {
      handleError(err, `Failed to remove dependencies "${packagesStr}"`);
    }
  });

program
  .command('run <script>')
  .alias('task')
  .description(
    "Run a local file or a script defined in the project's package.json."
  )
  .action(async (script) => {
    logger.info(`Running script "${script}"...`);
    try {
      await run(script, defaultOptions);
      logger.success(`Script "${script}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute script "${script}"`);
    }
  });

program
  .command('exec <command...>')
  .description("Execute a shell command using the project's package manager.")
  .action(async (cmd) => {
    const commandStr = cmd.join(' ');
    logger.info(`Executing shell command: "${commandStr}".`);
    try {
      await exec(commandStr, defaultOptions);
      logger.success(`Shell command "${commandStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute shell command "${commandStr}"`);
    }
  });

program
  .command('dlx <package> [args...]')
  .description(
    'Run a package temporarily without adding it as a project dependency.'
  )
  .action(async (pkg, args) => {
    const argsStr = args?.join(' ') || '';
    logger.info(`Running DLX package "${pkg}" with args: "${argsStr}".`);
    try {
      await dlx([pkg, argsStr].join(' '), defaultOptions);
      logger.success(`DLX package "${pkg}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute DLX package "${pkg}"`);
    }
  });

program
  .command('x <command> [args...]')
  .description(
    'Shortcut for executing commands, similar to "npm|bun x" or "pnpm|yarn exec/dlx" depending on package presence.'
  )
  .action(async (cmd, args) => {
    const argsStr = args.join(' ');
    logger.info(`Executing shortcut command: "${argsStr}".`);
    try {
      await x([cmd, argsStr].join(' '), defaultOptions);
      logger.success(`Shortcut command "${argsStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute shortcut command "${argsStr}"`);
    }
  });

program
  .command('jsr-add <packages...>')
  .alias('jsr-use')
  .description('Add one or more JSR dependencies to the project.')
  .action(async (packages) => {
    const packagesStr = packages?.join(' ') || '';
    logger.info(`Adding JSR dependencies "${packagesStr}".`);
    try {
      await jsrAdd(packages, defaultOptions);
      logger.success(`JSR Dependencies "${packagesStr}" added successfully.`);
    } catch (err) {
      handleError(err, `Failed to add JSR dependencies "${packagesStr}"`);
    }
  });

program
  .command('jsr-remove <packages...>')
  .alias('jsr-uninstall')
  .description(
    'Remove one or more JSR dependencies from the project dependencies.'
  )
  .action(async (packages) => {
    const packagesStr = packages?.join(' ') || '';
    logger.info(`Removing JSR dependencies "${packagesStr}".`);
    try {
      await jsrRemove(packages, defaultOptions);
      logger.success(`JSR Dependencies "${packagesStr}" removed successfully.`);
    } catch (err) {
      handleError(err, `Failed to remove JSR dependencies "${packagesStr}"`);
    }
  });

program
  .command('jsr-run <script>')
  .alias('jsr-exec')
  .description(
    "Run a JSR script or shell command defined in the project's package.json."
  )
  .action(async (script) => {
    logger.info(`Running JSR script "${script}"...`);
    try {
      await jsrRun(script, defaultOptions);
      logger.success(`JSR Script "${script}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute JSR script "${script}"`);
    }
  });

program
  .command('jsr-x <package> [args...]')
  .alias('jsr-dlx')
  .description(
    'Run a JSR package temporarily without adding it as a project dependency.'
  )
  .action(async (pkg, args) => {
    const argsStr = args?.join(' ') || '';
    logger.info(`Running JSR DLX package "${pkg}" with args: "${argsStr}".`);
    try {
      await jsrX([pkg, argsStr].join(' '), defaultOptions);
      logger.success(`JSR DLX package "${pkg}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute JSR DLX package "${pkg}"`);
    }
  });

program.on('command:*', () => {
  logger.error(
    'Invalid command. Use --help to see the list of available commands.'
  );
  process.exit(1);
});

/** @param args Pass here process.argv */
export function panam(args: string[]): Command {
  return program.parse(args);
}

export default function (): Command {
  return panam(process.argv);
}
