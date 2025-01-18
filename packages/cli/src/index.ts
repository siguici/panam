import { Command } from 'commander';
import { add, create, dlx, exec, install, remove, run, x } from 'panam';
import { description, name, version } from '../package.json';
import logger from './logger';

const program = new Command();

program.name(name).description(description).version(version);

const handleError = (err: any, context: string) => {
  const errorMessage = err?.message || 'An unexpected error occurred.';
  logger.error(`${context}: ${errorMessage}`);
};

// `create` command
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

// `install` command
program
  .command('install')
  .description('Install all project dependencies.')
  .action(async () => {
    logger.info('Installing project dependencies...');
    try {
      await install({ daemon: false });
      logger.success('All dependencies installed successfully.');
    } catch (err) {
      handleError(err, 'Dependency installation failed');
    }
  });

// `add` command
program
  .command('add <package>')
  .description('Add a package as a dependency to the project.')
  .action(async (pkg) => {
    logger.info(`Adding dependency "${pkg}".`);
    try {
      await add(pkg, { daemon: false });
      logger.success(`Dependency "${pkg}" added successfully.`);
    } catch (err) {
      handleError(err, `Failed to add dependency "${pkg}"`);
    }
  });

// `remove` command
program
  .command('remove <package>')
  .description('Remove a package from the project dependencies.')
  .action(async (pkg) => {
    logger.info(`Removing dependency "${pkg}".`);
    try {
      await remove(pkg, { daemon: false });
      logger.success(`Dependency "${pkg}" removed successfully.`);
    } catch (err) {
      handleError(err, `Failed to remove dependency "${pkg}"`);
    }
  });

// `run` command
program
  .command('run <script>')
  .description("Run a script defined in the project's package.json.")
  .action(async (script) => {
    logger.info(`Running script "${script}"...`);
    try {
      await run(script, { daemon: false });
      logger.success(`Script "${script}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute script "${script}"`);
    }
  });

// `exec` command
program
  .command('exec <command...>')
  .description("Execute a shell command using the project's package manager.")
  .action(async (cmd) => {
    const commandStr = cmd.join(' ');
    logger.info(`Executing shell command: "${commandStr}".`);
    try {
      await exec(commandStr, { daemon: false });
      logger.success(`Shell command "${commandStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute shell command "${commandStr}"`);
    }
  });

// `dlx` command
program
  .command('dlx <package> [args...]')
  .description(
    'Run a package temporarily without adding it as a project dependency.'
  )
  .action(async (pkg, args) => {
    const argsStr = args?.join(' ') || '';
    logger.info(`Running DLX package "${pkg}" with args: "${argsStr}".`);
    try {
      await dlx([pkg, argsStr].join(' '), { daemon: false });
      logger.success(`DLX package "${pkg}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute DLX package "${pkg}"`);
    }
  });

// `x` command
program
  .command('x <command...>')
  .description(
    'Shortcut for executing commands, similar to "npm|bun x" or "pnpm|yarn exec/dlx" depending on package presence.'
  )
  .action(async (cmd) => {
    const commandStr = cmd.join(' ');
    logger.info(`Executing shortcut command: "${commandStr}".`);
    try {
      await x(commandStr, { daemon: false });
      logger.success(`Shortcut command "${commandStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute shortcut command "${commandStr}"`);
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
