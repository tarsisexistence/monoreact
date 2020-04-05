#!/usr/bin/env node

import sade from 'sade';

import { addBinCommand } from './add.bin';
import { generateBinCommand } from './generate.bin';
import { installBinCommand } from './install.bin';
import { buildBinCommand } from './build.bin';
import { TITLE_CLI } from '../helpers/messages/common.messages';
import { serveBinCommand } from './serve.bin';
import pkg from '../../package.json';

const prog = sade('re-space');

console.log(TITLE_CLI);

addBinCommand(prog);
buildBinCommand(prog);
generateBinCommand(prog);
installBinCommand(prog);
serveBinCommand(prog);

prog.version(pkg.version).parse(process.argv);
