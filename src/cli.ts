#!/usr/bin/env node

import { Command } from 'commander';
import { add, dlx, exec, install, remove, run } from '.';
import { description, name, version } from '../package.json';
import logger from './logger';

const program = new Command();

program.name(name).description(description).version(version);

program
  .command('install')
  .description('Install all dependencies')
  .action(async () => {
    logger.info('Installing dependencies...');
    try {
      await install();
      logger.success('Dependencies installed successfully.');
    } catch (err) {
      logger.error('Failed to install dependencies.');
    }
  });

// `add` command
program
  .command('add <package>')
  .description('Add a package to dependencies')
  .action(async (pkg) => {
    logger.info(`Adding package "${pkg}"...`);
    try {
      await add(pkg);
      logger.success(`Package "${pkg}" added successfully.`);
    } catch (err) {
      logger.error(`Failed to add package "${pkg}".`);
    }
  });

// `remove` command
program
  .command('remove <package>')
  .description('Remove a package from dependencies')
  .action(async (pkg) => {
    logger.info(`Removing package "${pkg}"...`);
    try {
      await remove(pkg);
      logger.success(`Package "${pkg}" removed successfully.`);
    } catch (err) {
      logger.error(`Failed to remove package "${pkg}".`);
    }
  });

// `run` command
program
  .command('run <script>')
  .description('Run a script defined in package.json')
  .action(async (script) => {
    logger.info(`Running script "${script}"...`);
    try {
      await run(script);
      logger.success(`Script "${script}" executed successfully.`);
    } catch (err) {
      logger.error(`Failed to execute script "${script}".`);
    }
  });

// `exec` command
program
  .command('exec <command...>')
  .description('Execute a command using the package manager')
  .action(async (cmd) => {
    logger.info(`Executing command "${cmd.join(' ')}"...`);
    try {
      await exec(cmd.join(' '));
      logger.success(`Command "${cmd.join(' ')}" executed successfully.`);
    } catch (err) {
      logger.error(`Failed to execute command "${cmd.join(' ')}".`);
    }
  });

// `dlx` command
program
  .command('dlx <package> [args...]')
  .description('Run a package without installing it globally')
  .action(async (pkg, args) => {
    logger.info(`Running DLX package "${pkg}"...`);
    try {
      await dlx(pkg, args);
      logger.success(`DLX package "${pkg}" executed successfully.`);
    } catch (err) {
      logger.error(`Failed to execute DLX package "${pkg}".`);
    }
  });

// `x` command
program
  .command('x <command...>')
  .description(
    'Shortcut for executing a command using the package manager (alias for exec)'
  )
  .action(async (cmd) => {
    logger.info(`Executing command (shortcut) "${cmd.join(' ')}"...`);
    try {
      await exec(cmd.join(' ')); // Reuses the exec implementation
      logger.success(
        `Command (shortcut) "${cmd.join(' ')}" executed successfully.`
      );
    } catch (err) {
      logger.error(`Failed to execute command (shortcut) "${cmd.join(' ')}".`);
    }
  });

program.on('command:*', () => {
  logger.error('Invalid command. See --help for a list of available commands.');
  process.exit(1);
});

program.parse(process.argv);
