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
  .command('run <script> [args...]')
  .alias('task')
  .description(
    "Run a local file or a script defined in the project's package.json."
  )
  .action(async (script, args) => {
    const argsStr = args?.join(' ') || '';
    const scriptStr = argsStr ? `${script} ${argsStr}` : script;
    logger.info(`Running script "${scriptStr}".`);
    try {
      await run(scriptStr, defaultOptions);
      logger.success(`Script "${scriptStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute script "${scriptStr}"`);
    }
  });

program
  .command('exec <command...>')
  .description("Execute a shell command using the project's package manager.")
  .action(async (cmd) => {
    const commandStr = cmd.join(' ') || '';
    logger.info(`Executing shell command: "${commandStr}".`);
    try {
      await exec(commandStr, defaultOptions);
      logger.success(`Shell command "${commandStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute shell command "${commandStr}"`);
    }
  });

program
  .command('dlx <binary> [args...]')
  .description(
    'Run a binary temporarily without adding it as a project dependency.'
  )
  .action(async (bin, args) => {
    const argsStr = args?.join(' ') || '';
    const binStr = argsStr ? `${bin} ${argsStr}` : bin;
    logger.info(`Running DLX binary "${binStr}".`);
    try {
      await dlx(binStr, defaultOptions);
      logger.success(`DLX binary "${binStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute DLX binary "${binStr}"`);
    }
  });

program
  .command('x <executable> [args...]')
  .description(
    'Shortcut for executing commands, similar to "npm|bun x" or "pnpm|yarn exec/dlx" depending on package presence.'
  )
  .action(async (exec, args) => {
    const argsStr = args.join(' ');
    const execStr = argsStr ? `${exec} ${argsStr}` : exec;
    logger.info(`Executing shortcut command: "${execStr}".`);
    try {
      await x(execStr, defaultOptions);
      logger.success(`Shortcut command "${execStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute shortcut command "${execStr}"`);
    }
  });

program
  .command('jsr-add <packages...>')
  .alias('jsr:add')
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
  .alias('jsr:remove')
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
  .command('jsr-run <script> [args...]')
  .alias('jsr:run')
  .description(
    "Run a JSR script or shell command defined in the project's package.json."
  )
  .action(async (script, args) => {
    const argsStr = args?.join(' ') || '';
    const scriptStr = argsStr ? `${script} ${argsStr}` : script;
    logger.info(`Running JSR script "${scriptStr}".`);
    try {
      await jsrRun(scriptStr, defaultOptions);
      logger.success(`JSR Script "${scriptStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute JSR script "${scriptStr}"`);
    }
  });

program
  .command('jsr-x <binary> [args...]')
  .alias('jsr:x')
  .description(
    'Run a JSR binary temporarily without adding it as a project dependency.'
  )
  .action(async (bin, args) => {
    const argsStr = args?.join(' ') || '';
    const binStr = argsStr ? `${bin} ${argsStr}` : bin;
    logger.info(`Running JSR DLX binary "${binStr}".`);
    try {
      await jsrX(binStr, defaultOptions);
      logger.success(`JSR DLX binary "${binStr}" executed successfully.`);
    } catch (err) {
      handleError(err, `Failed to execute JSR DLX binary "${binStr}"`);
    }
  });

program.on('command:*', async (args) => {
  const script = args?.join(' ') || '';
  const isJsr = script.startsWith('jsr-') || script.startsWith('jsr:');
  logger.info(`Running${isJsr ? ' JSR' : ''} script "${script}".`);
  try {
    await run(script, defaultOptions);
    logger.success(
      `${isJsr ? ' JSR ' : ''}Script "${script}" executed successfully.`
    );
  } catch (err) {
    handleError(
      err,
      `Failed to execute${isJsr ? ' JSR' : ''} script "${script}"`
    );
  }
});

/** @param args Pass here process.argv */
export function panam(args: string[]): Command {
  return program.parse(args);
}

export default function (): Command {
  return panam(process.argv);
}
