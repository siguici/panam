import { Command } from 'commander';
import {
  add,
  create,
  dlx,
  exec,
  init,
  install,
  jsrAdd,
  jsrRemove,
  jsrRun,
  jsrX,
  remove,
  run,
  x
} from 'panam';
import type { PackageManagerName } from 'panam/pm';
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
  .command('init [package-manager]')
  .description('Initialize a new project.')
  .action(async (pm?: PackageManagerName) => {
    logger.info('Initializing project...');
    try {
      const result = pm
        ? await init(pm, defaultOptions)
        : await init(defaultOptions);

      result.status
        ? logger.success('Project initialized successfully.')
        : logger.error('Project initialization failed');
    } catch (err) {
      handleError(err, 'Failed to initialize a new project');
    }
  });

program
  .command('install')
  .description('Install all project dependencies.')
  .action(async () => {
    logger.info('Installing project dependencies...');
    try {
      const result = await install(defaultOptions);
      result.status
        ? logger.success('All dependencies installed successfully.')
        : logger.error('Dependency installation failed');
    } catch (err) {
      handleError(err, 'Failed to install dependencies');
    }
  });

program
  .command('create <cli> [args...]')
  .description('Create a new project or package using a template.')
  .action(async (cli, args) => {
    const argsStr = args?.join(' ') || '';
    const cliStr = argsStr ? `${cli} ${argsStr}` : cli;
    logger.info(`Initializing project with template "${cliStr}".`);
    try {
      const result = await create(cliStr, defaultOptions);
      result.status
        ? logger.success(`Project initialized successfully with "${cliStr}".`)
        : logger.error(`Project initialization failed with "${cliStr}".`);
    } catch (err) {
      handleError(err, `Failed to initialize project with "${cliStr}"`);
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
      const result = await add(packages, defaultOptions);
      result.status
        ? logger.success(`Dependencies "${packagesStr}" added successfully.`)
        : logger.error(`Dependencies "${packagesStr}" addition failed.`);
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
      const result = await remove(packages, defaultOptions);
      result.status
        ? logger.success(`Dependencies "${packagesStr}" removed successfully.`)
        : logger.error(`Dependencies "${packagesStr}" removal failed.`);
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
      const result = await run(scriptStr, defaultOptions);
      result.status
        ? logger.success(`Script "${scriptStr}" executed successfully.`)
        : logger.error(`Script "${scriptStr}" execution failed.`);
    } catch (err) {
      handleError(err, `Failed to execute script "${scriptStr}"`);
    }
  });

program
  .command('exec <command> [args...]')
  .description("Execute a shell command using the project's package manager.")
  .action(async (cmd, args) => {
    const argsStr = args?.join(' ') || '';
    const cmdStr = argsStr ? `${cmd} ${argsStr}` : cmd;
    logger.info(`Executing shell command: "${cmdStr}".`);
    try {
      const result = await exec(cmdStr, defaultOptions);
      result.status
        ? logger.success(`Shell command "${cmdStr}" executed successfully.`)
        : logger.error(`Shell command "${cmdStr}" execution failed.`);
    } catch (err) {
      handleError(err, `Failed to execute shell command "${cmdStr}"`);
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
      const result = await dlx(binStr, defaultOptions);
      result.status
        ? logger.success(`DLX binary "${binStr}" executed successfully.`)
        : logger.error(`DLX binary "${binStr}" execution failed.`);
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
      const result = await x(execStr, defaultOptions);
      result.status
        ? logger.success(`Shortcut command "${execStr}" executed successfully.`)
        : logger.error(`Shortcut command "${execStr}" execution failed.`);
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
      const result = await jsrAdd(packages, defaultOptions);
      result.status
        ? logger.success(
            `JSR Dependencies "${packagesStr}" added successfully.`
          )
        : logger.error(`JSR Dependencies "${packagesStr}" addition failed.`);
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
      const result = await jsrRemove(packages, defaultOptions);
      result.status
        ? logger.success(
            `JSR Dependencies "${packagesStr}" removed successfully.`
          )
        : logger.error(`JSR Dependencies "${packagesStr}" removal failed.`);
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
      const result = await jsrRun(scriptStr, defaultOptions);
      result.status
        ? logger.success(`JSR Script "${scriptStr}" executed successfully.`)
        : logger.error(`JSR Script "${scriptStr}" execution failed.`);
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
      const result = await jsrX(binStr, defaultOptions);
      result.status
        ? logger.success(`JSR DLX binary "${binStr}" executed successfully.`)
        : logger.error(`JSR DLX binary "${binStr}" execution failed.`);
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
