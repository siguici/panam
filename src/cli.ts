#!/usr/bin/env node

import { Command } from 'commander';
import { add, dlx, exec, install, remove, run } from '.';
import { description, name, version } from '../package.json';
import console from './console';

const program = new Command();

program.name(name).description(description).version(version);

program
  .command('install')
  .description('Install all dependencies')
  .action(async () => {
    await install();
    console.success('Dependencies installed successfully.');
  });

program
  .command('add <package>')
  .description('Add a package to dependencies')
  .action(async (pkg) => {
    await add(pkg);
    console.success(`Package "${pkg}" added successfully.`);
  });

program
  .command('remove <package>')
  .description('Remove a package from dependencies')
  .action(async (pkg) => {
    await remove(pkg);
    console.success(`Package "${pkg}" removed successfully.`);
  });

program
  .command('run <script>')
  .description('Run a script defined in package.json')
  .action(async (script) => {
    await run(script);
    console.success(`Script "${script}" executed successfully.`);
  });

program
  .command('exec <command...>')
  .description('Execute a command using the package manager')
  .action(async (cmd) => {
    await exec(cmd.join(' '));
    console.success(`Command "${cmd.join(' ')}" executed successfully.`);
  });

program
  .command('dlx <package> [args...]')
  .description('Run a package without installing it globally')
  .action(async (pkg, args) => {
    await dlx(pkg, args);
    console.success(`DLX package "${pkg}" executed successfully.`);
  });

program.on('command:*', () => {
  console.error(
    'Invalid command. See --help for a list of available commands.'
  );
  process.exit(1);
});

program.parse(process.argv);
