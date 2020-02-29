import { eraseLine } from 'ansi-escapes';
import chalk from 'chalk';
import ora from 'ora';

export const info = (msg: string) => {
  console.log(`${chalk.gray('>')} ${msg}`);
};

export const error = (msg: string | Error) => {
  if (msg instanceof Error) {
    msg = msg.message;
  }

  console.error(`${chalk.red('> Error!')} ${msg}`);
};

export const wait = (msg: string) => {
  const spinner = ora(chalk.green(msg));
  spinner.color = 'blue';
  spinner.start();

  return () => {
    spinner.stop();
    process.stdout.write(eraseLine);
  };
};

export const command = (command: string): string => chalk.bold.cyan(command);
